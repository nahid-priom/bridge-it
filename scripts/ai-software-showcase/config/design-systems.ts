/** Shared enterprise design system for AI software showcase generation. */

export const ENTERPRISE_DESIGN_SYSTEM = {
  id: 'enterprise-navy-red',
  visualVersion: 6,
  colors: {
    navy: '#0f2744',
    blue: '#1e3a5f',
    red: '#c41e3a',
    white: '#ffffff',
    softGray: '#f3f4f6',
    border: '#e5e7eb',
    text: '#111827',
  },
  shell: {
    sidebarWidthPx: 220,
    headerHeightPx: 56,
    radiusPx: 8,
  },
  negative: [
    'no neon',
    'no glassmorphism',
    'no Dribbble futurism',
    'no lorem ipsum',
    'no gibberish text',
    'no giant whitespace',
    'no purple gradients',
    'no 3D floating cards',
    'no unreadable micro text',
  ],
} as const;

export function baseDesignPrompt(): string {
  const c = ENTERPRISE_DESIGN_SYSTEM.colors;
  const s = ENTERPRISE_DESIGN_SYSTEM.shell;
  return [
    `DESIGN SYSTEM: Deep navy ${c.navy}, professional blue ${c.blue}, controlled red accent ${c.red}, white, light gray.`,
    `Desktop ERP shell: sidebar ~${s.sidebarWidthPx}px, header ~${s.headerHeightPx}px, radius ${s.radiusPx}px.`,
    'Odoo clarity + Stripe spacing + Linear compactness. Readable for business users aged 40+.',
    `NEGATIVE: ${ENTERPRISE_DESIGN_SYSTEM.negative.join('; ')}.`,
  ].join(' ');
}
