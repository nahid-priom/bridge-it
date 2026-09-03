'use client';

import { SEO_KEYWORD_IDEAS } from '../config/constants';
import { cmsInput, cmsMuted, cmsSection } from './ui';

export function SeoEditor({
  title,
  seoTitle,
  seoDescription,
  seoKeywords,
  slug,
  onChange,
  canEdit,
}: {
  title: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  slug: string;
  onChange: (patch: { seo_title?: string; seo_description?: string; seo_keywords?: string[] }) => void;
  canEdit: boolean;
}) {
  const displayTitle = seoTitle || title;
  const titleLen = displayTitle.length;
  const descLen = seoDescription.length;

  return (
    <section className={cmsSection}>
      <h2 className="font-display font-bold">SEO</h2>
      <label className="block text-sm">
        SEO Title
        <input
          value={seoTitle}
          disabled={!canEdit}
          onChange={(event) => onChange({ seo_title: event.target.value })}
          className={`mt-1 ${cmsInput}`}
        />
        <span className={titleLen > 70 ? 'text-red-500 text-xs' : cmsMuted}>{titleLen}/70</span>
      </label>
      <label className="block text-sm">
        Meta Description
        <textarea
          value={seoDescription}
          disabled={!canEdit}
          onChange={(event) => onChange({ seo_description: event.target.value })}
          rows={3}
          className={`mt-1 ${cmsInput}`}
        />
        <span className={descLen > 160 ? 'text-red-500 text-xs' : cmsMuted}>{descLen}/160</span>
      </label>
      <label className="block text-sm">
        Keywords (comma separated)
        <input
          value={seoKeywords.join(', ')}
          disabled={!canEdit}
          onChange={(event) =>
            onChange({
              seo_keywords: event.target.value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean),
            })
          }
          className={`mt-1 ${cmsInput}`}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        {SEO_KEYWORD_IDEAS.map((idea) => (
          <button
            key={idea}
            type="button"
            disabled={!canEdit}
            onClick={() => {
              if (seoKeywords.includes(idea)) return;
              onChange({ seo_keywords: [...seoKeywords, idea] });
            }}
            className="text-xs rounded-full border border-border-subtle px-2 py-1 text-text-muted"
          >
            {idea}
          </button>
        ))}
      </div>
      <div className="rounded-xl bg-white p-4 text-slate-800">
        <p className="text-xs text-slate-500">Search preview</p>
        <p className="text-[#1a0dab] text-lg leading-snug mt-1">{displayTitle || 'Untitled website'}</p>
        <p className="text-xs text-emerald-700">https://bridgeitpark.com/websites/{slug || 'your-slug'}</p>
        <p className="text-sm text-slate-600 mt-1">{seoDescription || 'Meta description will appear here.'}</p>
      </div>
    </section>
  );
}
