/**
 * About-page content. Add, remove, or rename groups freely — the page renders
 * whatever is in these arrays.
 */

export type SkillGroup = {
  title: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: 'Engineering',
    items: ['[TypeScript]', '[React]', '[Astro]', '[Node]', '[Testing]'],
  },
  {
    title: 'Design',
    items: ['[Interface design]', '[Design systems]', '[Motion]', '[Prototyping]'],
  },
  {
    title: 'Ways of working',
    items: ['[Discovery]', '[Technical writing]', '[Mentoring]', '[Accessibility]'],
  },
];

export type TimelineEntry = {
  /** A year or a range. Order carries meaning here, so keep it reverse-chronological. */
  period: string;
  role: string;
  org: string;
  note: string;
};

export const timeline: TimelineEntry[] = [
  {
    period: '2024 — Now',
    role: '[YOUR ROLE]',
    org: '[COMPANY OR CLIENT]',
    note: '[What you are responsible for, in one line.]',
  },
  {
    period: '2022 — 2024',
    role: '[PREVIOUS ROLE]',
    org: '[COMPANY OR CLIENT]',
    note: '[The thing you shipped that you would bring up in an interview.]',
  },
  {
    period: '2020 — 2022',
    role: '[EARLIER ROLE]',
    org: '[COMPANY, SCHOOL, OR SOLO]',
    note: '[Where you learned the craft.]',
  },
];
