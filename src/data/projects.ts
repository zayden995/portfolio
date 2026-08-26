/**
 * Projects.
 *
 * Nothing real is listed yet, and the three entries below say so on their face
 * rather than pretending otherwise. That is deliberate: a portfolio listing
 * work that does not exist is worse than one that admits the section is still
 * being filled.
 *
 * To add a real project, replace an entry: give it a title, a one-line summary,
 * the year, a link if there is one, and an image. Drop screenshots in
 * `public/work/` and point `image` at `/work/whatever.jpg`. Delete
 * `comingSoon` once it is genuinely there.
 *
 * Count matters here. `src/pages/projects.astro` shows the ring carousel at
 * three or more and a grid below that, because the ring's geometry is
 * undefined at one and two — see the note in `RoundCarousel.tsx`.
 */

export type Project = {
  /** Used in the URL and as the React list key. */
  slug: string;
  title: string;
  /** One line. What it is, in plain terms. */
  summary: string;
  year: string;
  /** Where the card points. Omit while there is nowhere to go. */
  href?: string;
  /** A path under `public/`, a full URL, or a generated placeholder. */
  image: string;
  imageAlt: string;
  /** True until there is real work behind the entry. */
  comingSoon?: boolean;
};

/**
 * A placeholder plate, drawn rather than fetched.
 *
 * The carousel takes images and nothing else — no titles, no captions — so a
 * "coming soon" label has to be part of the picture. An inline SVG keeps it in
 * the site's palette, costs no request, and stays sharp at any plate size.
 * Fonts cannot be loaded inside a data URI, so this asks for a system
 * grotesque rather than Switzer.
 */
function comingSoonPlate(index: number): string {
  const label = String(index).padStart(2, '0');
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">',
    '<rect width="800" height="800" fill="#0e0e0e"/>',
    '<rect x="10" y="10" width="780" height="780" fill="none" stroke="#262626" stroke-width="2"/>',
    // Nudged left of centre: letter-spacing adds a trailing gap that
    // text-anchor="middle" counts as part of the string.
    `<text x="396" y="392" text-anchor="middle" font-family="Helvetica Neue,Helvetica,Arial,sans-serif" font-size="36" letter-spacing="8" fill="#ededed">COMING SOON</text>`,
    `<text x="398" y="450" text-anchor="middle" font-family="Helvetica Neue,Helvetica,Arial,sans-serif" font-size="20" letter-spacing="5" fill="#8a8a8a">${label}</text>`,
    '</svg>',
  ].join('');

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const projects: Project[] = [
  {
    slug: 'coming-soon-01',
    title: 'Coming soon',
    summary: 'Work from the Applied AI & Data Analytics track will land here.',
    year: '2026',
    image: comingSoonPlate(1),
    imageAlt: 'Placeholder plate reading “Coming soon”, numbered 01.',
    comingSoon: true,
  },
  {
    slug: 'coming-soon-02',
    title: 'Coming soon',
    summary: 'Work from the Applied AI & Data Analytics track will land here.',
    year: '2026',
    image: comingSoonPlate(2),
    imageAlt: 'Placeholder plate reading “Coming soon”, numbered 02.',
    comingSoon: true,
  },
  {
    slug: 'coming-soon-03',
    title: 'Coming soon',
    summary: 'Work from the Applied AI & Data Analytics track will land here.',
    year: '2026',
    image: comingSoonPlate(3),
    imageAlt: 'Placeholder plate reading “Coming soon”, numbered 03.',
    comingSoon: true,
  },
];
