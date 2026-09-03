-- Homepage curated sections for ecommerce showcase templates.
-- Max 6 active placements per section. One project may appear in multiple sections.

create table if not exists public.ecommerce_homepage_placements (
  id uuid primary key default gen_random_uuid(),
  section_key text not null
    check (section_key in ('popular', 'fashion_lifestyle', 'electronics_gadgets', 'food_home_specialty')),
  project_id uuid not null references public.ecommerce_projects (id) on delete cascade,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (section_key, project_id)
);

create index if not exists idx_ecommerce_homepage_placements_section
  on public.ecommerce_homepage_placements (section_key, active, sort_order);

drop trigger if exists ecommerce_homepage_placements_updated_at on public.ecommerce_homepage_placements;
create trigger ecommerce_homepage_placements_updated_at
  before update on public.ecommerce_homepage_placements
  for each row execute function public.set_updated_at();

create or replace function public.enforce_homepage_section_max()
returns trigger
language plpgsql
as $$
declare
  active_count integer;
begin
  if new.active is not true then
    return new;
  end if;

  select count(*)::integer
    into active_count
  from public.ecommerce_homepage_placements
  where section_key = new.section_key
    and active = true
    and id is distinct from new.id;

  if active_count >= 6 then
    raise exception 'Homepage section "%" already has 6 active templates', new.section_key
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists ecommerce_homepage_placements_max6 on public.ecommerce_homepage_placements;
create trigger ecommerce_homepage_placements_max6
  before insert or update of active, section_key
  on public.ecommerce_homepage_placements
  for each row execute function public.enforce_homepage_section_max();

alter table public.ecommerce_homepage_placements enable row level security;

drop policy if exists "Public read active homepage placements" on public.ecommerce_homepage_placements;
create policy "Public read active homepage placements"
  on public.ecommerce_homepage_placements for select
  to anon, authenticated
  using (
    (
      active = true
      and exists (
        select 1
        from public.ecommerce_projects p
        where p.id = project_id
          and p.published = true
          and p.deleted_at is null
      )
    )
    or public.is_showcase_viewer()
  );

drop policy if exists "Editors manage homepage placements" on public.ecommerce_homepage_placements;
create policy "Editors manage homepage placements"
  on public.ecommerce_homepage_placements for all
  to authenticated
  using (public.is_showcase_editor())
  with check (public.is_showcase_editor());

create or replace view public.ecommerce_homepage_section_cards as
select
  h.section_key,
  h.sort_order,
  h.id as placement_id,
  p.id,
  p.title,
  p.slug,
  p.industry,
  p.cover_image_url,
  p.cover_fallback_url,
  p.starting_price,
  p.currency
from public.ecommerce_homepage_placements h
join public.ecommerce_projects p on p.id = h.project_id
where h.active = true
  and p.published = true
  and p.deleted_at is null;

grant select on public.ecommerce_homepage_section_cards to anon, authenticated;

insert into public.ecommerce_homepage_placements (section_key, project_id, sort_order, active)
select 'popular', p.id, row_number() over (order by p.sort_order, p.created_at desc) - 1, true
from public.ecommerce_projects p
where p.featured = true
  and p.published = true
  and p.deleted_at is null
order by p.sort_order, p.created_at desc
limit 6
on conflict (section_key, project_id) do nothing;
