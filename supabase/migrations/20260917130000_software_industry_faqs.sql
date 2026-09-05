-- Seed 3 FAQs each for 10 featured software industries.
-- Idempotent: skips when the same question already exists for that industry.

with featured as (
  select id, slug, name
  from public.catalog_industries
  where category_root = 'software'
    and deleted_at is null
    and active = true
    and slug in (
      'manufacturing',
      'garments',
      'feed-mill',
      'distribution',
      'retail-pos',
      'hospital',
      'restaurant',
      'real-estate',
      'construction',
      'logistics'
    )
),
faq_seed (industry_slug, question, answer, sort_order) as (
  values
    ('manufacturing',
     'What packages are available for manufacturing software?',
     'Manufacturing software includes Starter, Basic, Standard, Professional and Enterprise packages. Compare features on the industry page, then open the product page to pick a package and request a free demo.',
     10),
    ('manufacturing',
     'Is payment one-time or monthly?',
     'Packages are priced as a one-time payment for the scoped solution. Customization, training and support can be discussed during your demo.',
     20),
    ('manufacturing',
     'Can you customize the manufacturing ERP for our factory?',
     'Yes. Final software is customized to your BOM, production and costing workflow after we understand your operations.',
     30),

    ('garments',
     'Which garments package should we start with?',
     'Most factories choose Standard or Professional. Starter suits small teams; Enterprise fits multi-unit apparel groups. Use the package comparison on this page to decide.',
     10),
    ('garments',
     'Does garments software cover merchandising and production?',
     'Yes. Packages include style and merchandising tracking, cutting and production planning, buyer orders, fabric and trims inventory, and related reports depending on tier.',
     20),
    ('garments',
     'Can we get a free demo of the garments ERP?',
     'Yes. Click Free Demo on any package or product page and we will schedule a walkthrough of the workflow that matches your factory.',
     30),

    ('feed-mill',
     'What does Feed Mill ERP include?',
     'Packages cover feed formula management, production batches, raw material weighing, bag and dealer sales, quality logs and dealer ledgers depending on the tier you choose.',
     10),
    ('feed-mill',
     'Is Feed Mill software a one-time purchase?',
     'Yes. Listed package prices are one-time payments. Implementation scope and training are confirmed after your free demo.',
     20),
    ('feed-mill',
     'How do we choose between Standard and Professional?',
     'Standard fits most established mills. Professional adds deeper multi-department roles and reporting for larger operations.',
     30),

    ('distribution',
     'Does wholesale distribution software support multi-warehouse stock?',
     'Yes. Higher packages include multi-warehouse stock, route and delivery notes, dealer ledgers and territory sales reports.',
     10),
    ('distribution',
     'Can we order distribution software online?',
     'You can compare packages here, open the product page, select a package and use Order Now to start the consultation and scoping process.',
     20),
    ('distribution',
     'Is there a free demo for distribution ERP?',
     'Yes. Request a Free Demo from any package card and we will show party-wise sales, stock and delivery flows for your business.',
     30),

    ('retail-pos',
     'What retail POS packages are available?',
     'Retail & POS software offers Starter through Enterprise packages for single shops up to multi-store operations. Prices are one-time.',
     10),
    ('retail-pos',
     'Does POS software work for super shops?',
     'Yes. Packages scale from small shops to multi-store retail. Professional and Enterprise tiers fit larger store networks.',
     20),
    ('retail-pos',
     'Can we try the POS before ordering?',
     'Yes. Book a Free Demo from the package cards or product page to see billing, stock and reports in action.',
     30),

    ('hospital',
     'What does hospital management software cover?',
     'Packages support hospital administration, OPD/IPD workflows and billing. Exact modules depend on the package tier you select.',
     10),
    ('hospital',
     'Is hospital software sold as a subscription?',
     'Listed packages use one-time payment pricing. Ongoing support and customization options are discussed during consultation.',
     20),
    ('hospital',
     'How do we request a hospital software demo?',
     'Use Free Demo on the package or product page. Share your facility size so we can show the right package walkthrough.',
     30),

    ('restaurant',
     'Can restaurant software handle kitchen and billing?',
     'Yes. Restaurant packages cover food service operations including billing and kitchen-oriented workflows depending on tier.',
     10),
    ('restaurant',
     'Are restaurant packages one-time payments?',
     'Yes. Package prices are one-time. Implementation and training scope are confirmed after your demo.',
     20),
    ('restaurant',
     'Which package fits a single restaurant vs a chain?',
     'Starter and Basic suit single outlets. Standard and above are better for growing or multi-outlet operations.',
     30),

    ('real-estate',
     'What does real estate software manage?',
     'Packages support sales, plots and property operations. Compare features across Starter to Enterprise on this page.',
     10),
    ('real-estate',
     'Is real estate ERP customizable?',
     'Yes. After your free demo we customize workflows for your inventory, booking and customer processes.',
     20),
    ('real-estate',
     'How do we order a real estate package?',
     'Open the product page, select a package with the package tabs, then use Order Now to start scoping.',
     30),

    ('construction',
     'Does construction ERP include site costing?',
     'Yes. Construction packages cover project, materials and site costing workflows. Feature depth increases with higher tiers.',
     10),
    ('construction',
     'Is construction software a one-time fee?',
     'Listed package prices are one-time payments. Custom modules and training are scoped after consultation.',
     20),
    ('construction',
     'Can we compare construction packages side by side?',
     'Yes. Use the Compare Packages section on this page, then open View Details for the tier you prefer.',
     30),

    ('logistics',
     'What logistics software packages do you offer?',
     'Logistics & Transport software includes Starter through Enterprise packages for fleet, transport and route operations.',
     10),
    ('logistics',
     'Is logistics software priced monthly?',
     'No. Packages are shown as one-time payments. Support and customization options are discussed in your free demo.',
     20),
    ('logistics',
     'How do we book a logistics software demo?',
     'Click Free Demo on any package card. Tell us your fleet size so we can show the right package.',
     30)
)
insert into public.catalog_faqs (
  category_root,
  industry_id,
  product_kind,
  product_id,
  question,
  answer,
  sort_order,
  active
)
select
  'software',
  f.id,
  null,
  null,
  s.question,
  s.answer,
  s.sort_order,
  true
from featured f
join faq_seed s on s.industry_slug = f.slug
where not exists (
  select 1
  from public.catalog_faqs existing
  where existing.industry_id = f.id
    and existing.question = s.question
    and existing.active = true
);
