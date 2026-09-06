/** Shared Feed Mill enterprise design tokens for AI prompts + SVG fallback alignment. */

export const FEED_MILL_DESIGN_SYSTEM = {
  id: 'feed-mill-enterprise',
  visualVersion: 5,
  colors: {
    navy: '#0f2744',
    red: '#c41e3a',
    white: '#ffffff',
    softGray: '#f3f4f6',
    border: '#e5e7eb',
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    success: '#15803d',
    warning: '#b45309',
    danger: '#b91c1c',
  },
  shell: {
    sidebarWidthPx: 220,
    headerHeightPx: 56,
    radiusPx: 8,
    density: 'comfortable',
    typography: 'Inter / system UI, 14–15px body, 20–24px page titles',
    table: 'compact enterprise rows, subtle borders, sticky header',
    buttons: 'solid primary navy or red accent, 40–44px height',
    badges: 'small pill status: Open / In Progress / Completed / Overdue / QC Hold',
  },
  negativeRules: [
    'no neon colors',
    'no glassmorphism',
    'no 3D floating cards',
    'no Dribbble futuristic concept UI',
    'no giant whitespace',
    'no unreadable tiny text',
    'no lorem ipsum',
    'no decorative meaningless pie charts',
    'no mobile app layout inside desktop screenshot',
    'no duplicated sidebars',
    'no clipped tables or cut navigation',
    'no purple gradients',
  ],
} as const;

export function designSystemPromptBlock(): string {
  const c = FEED_MILL_DESIGN_SYSTEM.colors;
  const s = FEED_MILL_DESIGN_SYSTEM.shell;
  return [
    'DESIGN SYSTEM (must match every screen of this product family):',
    `- Deep navy ${c.navy}, professional red accent ${c.red}, white surfaces, soft gray ${c.softGray}`,
    `- Desktop-first ERP: left sidebar ~${s.sidebarWidthPx}px, top header ~${s.headerHeightPx}px`,
    `- ${s.typography}; ${s.table}; ${s.buttons}; ${s.badges}`,
    `- Border radius ~${s.radiusPx}px; subtle borders; Odoo clarity + Stripe spacing + Linear compactness`,
    `- Target users include Feed Mill owners and staff aged 40+ — keep UI readable`,
    `NEGATIVE: ${FEED_MILL_DESIGN_SYSTEM.negativeRules.join('; ')}`,
  ].join('\n');
}
