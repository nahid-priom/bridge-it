import type { CatalogFaq } from '@/src/features/catalog/types';
import { CatalogFaqList } from '@/src/features/catalog/components/CatalogFaqList';

const COMMERCIAL_FAQ_FALLBACK: Array<{ question: string; answer: string }> = [
  {
    question: 'Is this a one-time payment?',
    answer:
      'Yes. Listed package prices are one-time license fees unless a package explicitly says otherwise. You choose the tier that fits your business size.',
  },
  {
    question: 'Can we customize the software?',
    answer:
      'Yes. After you order a package, we scope custom workflows, reports, and integrations based on your operation. Custom work is quoted separately when needed.',
  },
  {
    question: 'Can we upgrade later?',
    answer:
      'Yes. You can move from Starter → Basic → Standard → Professional → Enterprise as your team grows. Upgrade pricing is confirmed against the current package ladder when you are ready.',
  },
  {
    question: 'How many users are included?',
    answer:
      'User capacity depends on the selected package. Higher tiers include more roles, approvals, and operational seats. Tell us your team size when you request a demo or order.',
  },
  {
    question: 'Do you help with data migration?',
    answer:
      'We support practical migration from spreadsheets or your previous system as part of onboarding. Complexity and timeline depend on your current data quality.',
  },
  {
    question: 'Is training included?',
    answer:
      'Yes. Package onboarding includes guided setup and training for your key operators so your team can run day-to-day work confidently.',
  },
];

export function SoftwareProductFaq({
  faqs,
  className,
}: {
  faqs: CatalogFaq[];
  className?: string;
}) {
  const items =
    faqs.length > 0
      ? faqs
      : COMMERCIAL_FAQ_FALLBACK.map((faq, index) => ({
          id: `commercial-faq-${index}`,
          category_root: 'software' as const,
          industry_id: null,
          product_kind: 'software' as const,
          product_id: null,
          question: faq.question,
          answer: faq.answer,
          sort_order: index,
          active: true,
        }));

  return (
    <div className={className}>
      <CatalogFaqList faqs={items} title="Frequently asked questions" />
    </div>
  );
}
