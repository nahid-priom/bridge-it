type CoverAltInput = {
  title: string;
  category?: string | null;
};

export function buildCoverAltText({ title, category }: CoverAltInput): string {
  const categoryPart = category ? ` — ${category}` : '';
  return `${title}${categoryPart} cover image`;
}
