-- Expand Feed Mill industry FAQs for ERP vs specialized positioning.
-- Idempotent: replace prior feed-mill industry FAQs with canonical set.

with fm as (
  select id from public.catalog_industries
  where category_root = 'software' and slug = 'feed-mill' and deleted_at is null
  limit 1
)
delete from public.catalog_faqs f
using fm
where f.industry_id = fm.id
  and f.product_id is null
  and f.category_root = 'software';

with fm as (
  select id from public.catalog_industries
  where category_root = 'software' and slug = 'feed-mill' and deleted_at is null
  limit 1
)
insert into public.catalog_faqs (
  category_root, industry_id, product_kind, product_id, question, answer, sort_order, active
)
select
  'software',
  fm.id,
  null,
  null,
  v.question,
  v.answer,
  v.sort_order,
  true
from fm
cross join (
  values
    (
      10,
      'What does Feed Mill ERP include?',
      'Complete Feed Mill ERP covers raw materials, formula, production batches, finished feed, dealer sales, dispatch, collection, ledgers and P&L — with packages from Starter to Enterprise.'
    ),
    (
      20,
      'What is the difference between Complete Feed Mill ERP and Specialized Software?',
      'Complete ERP runs the whole mill in one system. Specialized products (Production, Formula & Costing, Dealer, Inventory, Finance) go deeper in one department when you are not ready for a full ERP.'
    ),
    (
      30,
      'Can I start with only Production or Formula Software?',
      'Yes. Many mills start with Production or Formula & Costing, then add Dealer, Inventory or Finance modules — or upgrade to Complete Feed Mill ERP later.'
    ),
    (
      40,
      'Can specialized systems later be upgraded into the full ERP?',
      'Yes. Specialized tools map to the same Feed Mill workflow. You can expand module by module or move to the complete ERP package when the mill is ready.'
    ),
    (
      50,
      'Is pricing one-time?',
      'Yes. Bridge IT Park Feed Mill software uses clear one-time package pricing in BDT — not monthly SaaS lock-in.'
    ),
    (
      60,
      'Can the system be customized?',
      'Yes. We can adjust formulas, reports, dealer workflows and accounts to match your mill. Request a free demo to discuss customization.'
    )
) as v(sort_order, question, answer);

notify pgrst, 'reload schema';
