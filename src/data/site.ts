/**
 * Site-wide details and the hero.
 *
 * This is the first file to edit. Anything in square brackets is a placeholder —
 * search the project for "[" to find every one of them.
 *
 * The content layer is five files, and nothing editable lives outside them:
 *   site.ts         — you, the nav, the hero        (this file)
 *   about.ts        — statement, bio, pillars, candidature, skills
 *   involvements.ts — the events track
 *   projects.ts     — the technical work track
 *   experiences.ts  — the index list
 *
 * types.ts holds the shared card shape; it has no content in it.
 */

export const site = {
  name: 'Zayden Chua',
  /** Shown in the browser tab after the page title. */
  shortName: 'Zayden Chua',
  title: 'Zayden Chua — planning, publicity, operations',
  description:
    'Singapore Polytechnic student. Four years of committees spent on whether anyone turns up, and whether the day runs.',
  school: 'Singapore Polytechnic',
  course: 'Diploma in Information Technology',
  specialisation: 'Applied AI & Data Analytics',
  /** Bump this each academic year. */
  yearOfStudy: 'Year 2 of 3',
  graduating: 'April 2028',
  location: 'Singapore',
  /** IANA zone. Drives the live clock in Reach. */
  timezone: 'Asia/Singapore',
  email: 'zaydenchua7@gmail.com',
} as const;

/**
 * The hero.
 *
 * `statement` is one array entry per line. Each line rises into view
 * separately, so keep each short enough that it does not wrap on its own —
 * a wrapped line splits into two and the stagger goes out of step.
 */
export const hero = {
  statement: ['I plan the things', 'that bring people', 'together.'],
  intro:
    'Four years of committees, mostly spent on two questions: whether anyone turns up, and whether the day runs.',
  cue: 'Scroll',
  /** The four cells along the bottom of the hero. */
  facts: [
    { label: 'Based in', value: 'Singapore' },
    { label: 'Reading', value: 'Diploma in Information Technology' },
    { label: 'Standing', value: 'Year 2 of 3' },
    { label: 'Specialisation', value: 'Applied AI & Data Analytics' },
  ],
} as const;

export type NavItem = {
  label: string;
  /** An in-page anchor. Every one must match a section id in index.astro. */
  href: string;
};

/**
 * Six anchors. The Statement section is deliberately absent — it is the beat
 * between the hero and About, meant to be scrolled through rather than jumped
 * to. Six is the ceiling before the bar crowds at tablet widths.
 */
export const navItems: NavItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Involvements', href: '#involvements' },
  { label: 'Experiences', href: '#experiences' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export type SocialLink = {
  label: string;
  /** Shown next to the label — your handle, not the full URL. */
  handle: string;
  /** Leave this off to show the handle as plain text instead of a link. */
  href?: string;
};

export const socialLinks: SocialLink[] = [
  {
    label: 'WhatsApp',
    handle: 'zxyden',
    /* No href on purpose. A WhatsApp username has no documented public link
       format, so linking it would mean guessing a URL. To make it clickable,
       use a wa.me link with your number instead:
         href: 'https://wa.me/65XXXXXXXX',
       and the handle below will turn into a link on its own. */
  },
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
