import type { CatalogFaq } from '../types';

export function CatalogFaqList({
  faqs,
  title = 'Frequently asked questions',
}: {
  faqs: CatalogFaq[];
  title?: string;
}) {
  if (!faqs.length) return null;

  return (
    <section className="mt-10 md:mt-14">
      <h2 className="font-display text-xl font-black text-[#0f2744] dark:text-white md:text-2xl">
        {title}
      </h2>
      <div className="mt-4 divide-y divide-border-subtle border-y border-border-subtle">
        {faqs.map((faq) => (
          <details key={faq.id} className="group py-4">
            <summary className="cursor-pointer list-none font-semibold text-text-primary marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-3">
                <span>{faq.question}</span>
                <span
                  aria-hidden
                  className="mt-0.5 shrink-0 text-text-muted transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
