'use server';

import { createConsultationRequest } from '@/lib/services/consultation.service';
import { getAdminClient } from '@/lib/services/client';

export type SoftwarePackageLeadInput = {
  name: string;
  phone: string;
  business_name?: string;
  business_location?: string;
  requirement?: string;
  software_project_id: string;
  package_id?: string;
  product_slug: string;
  product_title: string;
  source_url?: string;
  intent: 'demo' | 'order';
};

export async function submitSoftwarePackageLeadAction(
  input: SoftwarePackageLeadInput
): Promise<{ error?: string }> {
  const name = input.name?.trim();
  const phone = input.phone?.trim();
  if (!name || !phone) return { error: 'Name and phone are required' };
  if (!input.software_project_id) {
    return { error: 'Product is required' };
  }

  // Prefer admin client so price validation works even if RLS hides packages from anon
  const admin = await getAdminClient();
  if (admin && input.package_id) {
    const { data: pkg } = await admin
      .from('software_packages')
      .select('id, project_id, name, tier, price, currency, active, deleted_at')
      .eq('id', input.package_id)
      .maybeSingle();
    if (!pkg || !pkg.active || pkg.deleted_at) {
      return { error: 'Selected package is not available' };
    }
    if (String(pkg.project_id) !== input.software_project_id) {
      return { error: 'Selected package does not belong to this product' };
    }
  }

  const intentLabel = input.intent === 'demo' ? 'Free Demo' : 'Order';
  const result = await createConsultationRequest({
    name,
    phone,
    business_name: input.business_name,
    business_location: input.business_location,
    service_interested_in: `${input.product_title} — ${intentLabel}`,
    message: input.requirement?.trim() || undefined,
    software_project_id: input.software_project_id,
    package_id: input.package_id,
    product_slug: input.product_slug,
    source_url: input.source_url,
    intent: input.intent,
  });

  return { error: result.error ?? undefined };
}
