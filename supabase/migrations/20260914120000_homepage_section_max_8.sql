-- Raise curated homepage section capacity from 6 to 8 templates per category.

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

  if active_count >= 8 then
    raise exception 'Homepage section "%" already has 8 active templates', new.section_key
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists ecommerce_homepage_placements_max6 on public.ecommerce_homepage_placements;
drop trigger if exists ecommerce_homepage_placements_max8 on public.ecommerce_homepage_placements;
create trigger ecommerce_homepage_placements_max8
  before insert or update of active, section_key
  on public.ecommerce_homepage_placements
  for each row execute function public.enforce_homepage_section_max();
