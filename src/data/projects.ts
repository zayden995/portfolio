/**
 * Projects.
 *
 * Swap these four placeholders for your real work. The Projects index and the
 * "Selected work" block on the home page both read from this array, so adding,
 * removing, or reordering entries here updates both. No other file needs to
 * change.
 *
 * Images are Unsplash placeholders. Replace `image` with your own screenshot —
 * either a full URL or a file you drop in `public/` (e.g. "/work/my-app.jpg").
 */

export type Project = {
  /** Used in the URL and as the React list key. */
  slug: string;
  title: string;
  /** One line. What it is, in plain terms. */
  summary: string;
  /** Your part in it. */
  role: string;
  year: string;
  /** Three or four is the sweet spot. */
  tags: string[];
  image: string;
  imageAlt: string;
  /** Where the card points. Swap for a live URL or a case-study page. */
  href: string;
  /** Pulled out onto the home page. Keep this to three. */
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: 'project-one',
    title: '[PROJECT TITLE ONE]',
    summary:
      '[One sentence on what this product does and who it is for. Say the useful thing, not the impressive thing.]',
    role: '[Design & Build]',
    year: '2025',
    tags: ['[Product]', '[React]', '[Design System]'],
    image:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    imageAlt: '[Describe your project screenshot here]',
    href: '#',
    featured: true,
  },
  {
    slug: 'project-two',
    title: '[PROJECT TITLE TWO]',
    summary:
      '[One sentence on the problem you were handed and the shape of the thing you shipped.]',
    role: '[Frontend Engineering]',
    year: '2025',
    tags: ['[Web App]', '[TypeScript]', '[Data Viz]'],
    image:
      'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?auto=format&fit=crop&w=1200&q=80',
    imageAlt: '[Describe your project screenshot here]',
    href: '#',
    featured: true,
  },
  {
    slug: 'project-three',
    title: '[PROJECT TITLE THREE]',
    summary:
      '[One sentence. If the result had a number attached to it, this is where that number goes.]',
    role: '[Lead Developer]',
    year: '2024',
    tags: ['[Brand]', '[Motion]', '[WebGL]'],
    image:
      'https://images.unsplash.com/photo-1507908708918-778587c9e563?auto=format&fit=crop&w=1200&q=80',
    imageAlt: '[Describe your project screenshot here]',
    href: '#',
    featured: true,
  },
  {
    slug: 'project-four',
    title: '[PROJECT TITLE FOUR]',
    summary:
      '[One sentence. Side projects belong here too — they say as much about you as client work.]',
    role: '[Solo Project]',
    year: '2024',
    tags: ['[Open Source]', '[Tooling]', '[CLI]'],
    image:
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
    imageAlt: '[Describe your project screenshot here]',
    href: '#',
    featured: false,
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
