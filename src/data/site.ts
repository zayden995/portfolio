/**
 * Site-wide details.
 *
 * This is the first file to edit. Anything still in square brackets is a
 * placeholder — search the project for "[" to find every one of them.
 */

export const site = {
  name: 'Zayden Chua',
  /** Shown in the browser tab after the page title. */
  shortName: 'Zayden Chua',
  school: 'Singapore Polytechnic',
  course: 'Diploma in Information Technology',
  specialisation: 'Applied AI & Data Analytics',
  /** Bump this each academic year. */
  yearOfStudy: 'Year 2 of 3',
  graduating: 'April 2028',
  location: 'Singapore',
  email: 'zaydenchua7@gmail.com',
  /**
   * The home page headline, one array entry per line. Each line rises into
   * view separately, so keep them short enough not to wrap.
   */
  statement: ['I plan the things', 'that bring people together.'],
} as const;

export type NavItem = {
  label: string;
  href: string;
};

/* Involvements comes before Projects on purpose: the site's argument is what
   he does outside class, and the running order should say so. */
export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Involvements', href: '/involvements' },
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
  {
    label: 'Email',
    handle: 'zaydenchua7@gmail.com',
    href: 'mailto:zaydenchua7@gmail.com',
  },
  {
    label: 'LinkedIn',
    handle: '/in/zayden-chua',
    href: 'https://linkedin.com/in/zayden-chua',
  },
  {
    label: 'GitHub',
    handle: '@zayden995',
    href: 'https://github.com/zayden995',
  },
];
