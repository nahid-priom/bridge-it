export function WebsitesPageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="mb-6 md:mb-8">
      <h1 className="font-display text-[clamp(1.75rem,2.4vw,2.75rem)] font-black leading-tight tracking-tight text-text-primary">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">{description}</p>
    </header>
  );
}
