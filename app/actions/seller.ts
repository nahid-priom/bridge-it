'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { assertAdminAction } from '@/lib/auth/admin-action';
import { getCurrentProfile } from '@/lib/auth/get-current-user';
import { insertAdminAuditLog } from '@/lib/db/admin';
import { sellerApplicationSchema, type SellerApplicationInput } from '@/lib/validations/seller';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

export async function submitSellerApplicationAction(raw: SellerApplicationInput) {
  const parsed = sellerApplicationSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const profile = await getCurrentProfile();
  if (!profile) return { error: 'Sign in to apply as a seller.' };
  if (profile.role === 'seller') return { error: 'You are already a seller.' };
  if (profile.role === 'admin') return { error: 'Admins use the admin panel.' };

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { error: 'Supabase is not configured.' };

  const data = parsed.data;
  const services = data.servicesOffered
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const social_links: Record<string, string> = {};
  if (data.linkedin?.trim()) social_links.linkedin = data.linkedin.trim();
  if (data.facebook?.trim()) social_links.facebook = data.facebook.trim();
  if (data.website?.trim()) social_links.website = data.website.trim();

  const { data: existing } = await supabase
    .from('seller_applications')
    .select('id, status')
    .eq('user_id', profile.id)
    .maybeSingle();

  const payload = {
    user_id: profile.id,
    full_name: data.fullName,
    business_name: data.businessName,
    display_name: data.displayName,
    category_focus: data.categoryFocus,
    services_offered: services,
    portfolio_url: data.portfolioUrl?.trim() || null,
    social_links,
    phone: data.phone,
    location: data.location,
    bio: data.bio,
    experience_level: data.experienceLevel,
    ad_interest: data.adInterest,
    ad_budget_range: data.adBudgetRange?.trim() || null,
    status: 'pending' as const,
  };

  if (existing) {
    if (existing.status === 'approved') {
      return { error: 'Your application is already approved.' };
    }
    const { error } = await supabase
      .from('seller_applications')
      .update(payload as never)
      .eq('id', existing.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from('seller_applications').insert(payload as never);
    if (error) return { error: error.message };
  }

  const { data: app } = await supabase
    .from('seller_applications')
    .select('id')
    .eq('user_id', profile.id)
    .single();

  if (app && data.adInterest && data.promotionCategory) {
    await supabase.from('seller_ad_preferences').delete().eq('application_id', app.id);
    await supabase.from('seller_ad_preferences').insert({
      application_id: app.id,
      category_key: data.promotionCategory,
      promotion_type: 'featured',
      budget_range: data.adBudgetRange ?? null,
      note: data.promotionNote ?? null,
    } as never);
  }

  revalidatePath('/seller/onboarding');
  return { success: true as const };
}

export async function reviewSellerApplicationAction(input: {
  applicationId: string;
  decision: 'approved' | 'rejected' | 'needs_review';
  adminNote?: string;
}) {
  const admin = await assertAdminAction();
  if ('error' in admin) return { error: admin.error };

  if (input.decision === 'rejected' && !input.adminNote?.trim()) {
    return { error: 'A rejection reason is required.' };
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) return { error: 'Supabase not configured.' };

  const { data: app, error: fetchErr } = await supabase
    .from('seller_applications')
    .select('*')
    .eq('id', input.applicationId)
    .single();

  if (fetchErr || !app) return { error: 'Application not found.' };

  if (input.decision === 'approved') {
    const baseSlug = slugify(app.display_name);
    const slug = `${baseSlug}-${app.user_id.slice(0, 8)}`;

    const { data: seller, error: sellerErr } = await supabase
      .from('sellers')
      .upsert(
        {
          user_id: app.user_id,
          slug,
          name: app.display_name,
          tagline: app.business_name,
          description: app.bio,
          location: app.location,
          category_key: app.category_focus,
          verified: false,
          is_public: true,
          status: 'active',
        },
        { onConflict: 'slug' }
      )
      .select('id')
      .single();

    if (sellerErr || !seller) return { error: sellerErr?.message ?? 'Failed to create seller.' };

    await supabase
      .from('profiles')
      .update({ role: 'seller', seller_id: seller.id })
      .eq('id', app.user_id);

    await supabase
      .from('seller_applications')
      .update({
        status: 'approved',
        admin_note: input.adminNote ?? null,
        reviewed_by: admin.userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', app.id);

    await supabase.from('notifications').insert({
      user_id: app.user_id,
      title: 'Seller application approved',
      body: 'Your seller application has been approved. You can access your seller dashboard.',
      type: 'seller_approved',
      metadata: { application_id: app.id, seller_id: seller.id },
    });
  } else {
    await supabase
      .from('seller_applications')
      .update({
        status: input.decision,
        admin_note: input.adminNote ?? null,
        reviewed_by: admin.userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', app.id);

    if (input.decision === 'rejected') {
      await supabase.from('notifications').insert({
        user_id: app.user_id,
        title: 'Seller application update',
        body: input.adminNote ?? 'Your application was not approved.',
        type: 'seller_rejected',
        metadata: { application_id: app.id },
      });
    }
  }

  await insertAdminAuditLog({
    action: input.decision,
    tableName: 'seller_applications',
    recordId: app.id,
    payload: { decision: input.decision, adminNote: input.adminNote },
    adminId: admin.userId,
  });

  revalidatePath('/admin');
  revalidatePath('/seller/onboarding');
  revalidatePath('/dashboard/seller');
  return { success: true as const };
}
