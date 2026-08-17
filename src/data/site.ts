/**
 * Site-wide details.
 *
 * This is the first file to edit. Everything in square brackets is a
 * placeholder — search the project for "[" to find every one of them.
 */

export const site = {
  name: '[YOUR NAME]',
  /** Shown in the browser tab after the page title. */
  shortName: '[YOUR NAME]',
  role: '[YOUR ROLE]',
  location: '[CITY, COUNTRY]',
  email: '[you@example.com]',
  /** Set to false when you are not taking on new work. */
  available: true,
  availabilityNote: 'Available for select work',
} as const;

export type NavItem = {
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
];

export type SocialLink = {
  label: string;
  /** Shown next to the label — your handle, not the full URL. */
  handle: string;
  href: string;
};

export const socialLinks: SocialLink[] = [
  { label: 'Email', handle: '[you@example.com]', href: 'mailto:[you@example.com]' },
  { label: 'LinkedIn', handle: '[/in/your-handle]', href: 'https://linkedin.com/in/[your-handle]' },
  { label: 'GitHub', handle: '[@your-handle]', href: 'https://github.com/[your-handle]' },
  { label: 'Read.cv', handle: '[@your-handle]', href: 'https://read.cv/[your-handle]' },
];
