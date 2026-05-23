import { CheckCircle2, ListOrdered, HelpCircle } from 'lucide-react';
import type { Product } from '@/types/product';
import { cn } from '@/lib/cn';

interface ProductDetailContentProps {
  product: Product;
}

export function ProductDetailContent({ product }: ProductDetailContentProps) {
  return (
    <div className="space-y-10 md:space-y-12">
      <section aria-labelledby="service-overview-heading">
        <h2 id="service-overview-heading" className="text-xl md:text-2xl font-bold font-display text-text-primary mb-4">
          Service Overview
        </h2>
        {product.overview && (
          <p className="text-text-secondary leading-relaxed mb-4">{product.overview}</p>
        )}
        <p className="text-text-secondary leading-relaxed">{product.description}</p>
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium bg-bridge-primary/10 text-bridge-primary border border-bridge-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </section>

      {product.included && product.included.length > 0 && (
        <section aria-labelledby="whats-included-heading">
          <h2
            id="whats-included-heading"
            className="text-xl md:text-2xl font-bold font-display text-text-primary mb-4 flex items-center gap-2"
          >
            <CheckCircle2 className="w-6 h-6 text-bridge-primary" aria-hidden />
            What&apos;s included
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {product.included.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-border-subtle bg-surface/60 px-4 py-3 text-sm text-text-secondary"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bridge-primary" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {product.process && product.process.length > 0 && (
        <section aria-labelledby="how-it-works-heading">
          <h2
            id="how-it-works-heading"
            className="text-xl md:text-2xl font-bold font-display text-text-primary mb-6 flex items-center gap-2"
          >
            <ListOrdered className="w-6 h-6 text-bridge-primary" aria-hidden />
            How it works
          </h2>
          <ol className="grid gap-4 sm:grid-cols-2">
            {product.process.map((step, index) => (
              <li
                key={step}
                className="relative rounded-2xl border border-border-subtle bg-surface/80 p-5 pl-14"
              >
                <span
                  className={cn(
                    'absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full',
                    'bg-bridge-primary text-white text-sm font-bold'
                  )}
                  aria-hidden
                >
                  {index + 1}
                </span>
                <p className="text-sm text-text-secondary leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {product.faqs && product.faqs.length > 0 && (
        <section aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="text-xl md:text-2xl font-bold font-display text-text-primary mb-4 flex items-center gap-2"
          >
            <HelpCircle className="w-6 h-6 text-bridge-primary" aria-hidden />
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {product.faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-border-subtle bg-surface/60 px-5 py-4 open:bg-surface/90"
              >
                <summary className="cursor-pointer text-sm font-semibold text-text-primary list-none flex items-center justify-between gap-2">
                  {faq.question}
                  <span className="text-text-muted group-open:rotate-45 transition-transform text-lg" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-text-secondary leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
