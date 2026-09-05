/**
 * Site-wide Portfolio atmosphere glow (behind content).
 * Gradient canvas is applied via `.site-atmosphere-bg` on the public shell.
 * Decorative marks stay on page heroes so they are not doubled.
 */
export function SiteAtmosphere() {
  return <div className="site-atmosphere-glow" aria-hidden />;
}
