/**
 * The Statement, About and Skills sections.
 */

/**
 * Section 2. One large sentence and the numbers under it.
 *
 * `value` must be a plain integer — the counter animates from zero to it. Put
 * any "+" or "%" in `suffix`, not in the number, or the count breaks.
 */
export const statement = {
  sentence: 'It is never really about the event.',
  lede: 'It is about whether anyone turns up, and whether the day runs. Four years of committees have mostly been practice at those two things.',
  stats: [
    { value: 13, suffix: '', label: 'Years volunteering at the same temple' },
    { value: 9, suffix: '', label: 'Events planned or publicised' },
    { value: 5, suffix: '', label: 'Committee roles held' },
    { value: 20, suffix: '', label: 'Students taught each Sunday' },
  ],
} as const;

/**
 * Section 3. Bio, the value blocks, and the candidature spec table.
 */
export const about = {
  heading: 'About me.',
  bio: [
    'I am a second-year Diploma in Information Technology student at Singapore Polytechnic, specialising in Applied AI and Data Analytics.',
    'Most of what I have learned about getting things done came from committees rather than classrooms — publicity campaigns that had to fill a room, run sheets that had to survive contact with the day, and thirteen years at the same temple.',
  ],
  pillars: [
    {
      title: 'Planning',
      body: 'From the first brief to closing night — logistics, scheduling, and the running order.',
    },
    {
      title: 'Publicity',
      body: 'Campaigns that fill the room. Industry Connect, SPxHP, Open House, BrainHack.',
    },
    {
      title: 'Operations',
      body: 'On the ground on the day, holding the experience steady when the schedule slips.',
    },
    {
      title: 'Turning up',
      body: 'Thirteen years at Chong Hua Tong, now running the class I used to sit in.',
    },
  ],
} as const;

/**
 * The candidature spec table, and the drawing beside it.
 *
 * `start` and `end` drive the blueprint SVG: the elapsed bar and the NOW marker
 * are computed from them against today's date, so the drawing stays correct
 * without being edited. Both are ISO dates.
 */
export const candidature = {
  heading: 'Three years, specified.',
  start: '2025-04-01',
  end: '2028-04-01',
  rows: [
    { label: 'Programme', value: 'Diploma in Information Technology' },
    { label: 'Specialisation', value: 'Applied AI & Data Analytics' },
    { label: 'Institution', value: 'Singapore Polytechnic' },
    { label: 'Candidature', value: 'Apr 2025 — Apr 2028' },
    { label: 'Standing', value: 'Year 2 of 3' },
    { label: 'Base', value: 'Singapore' },
  ],
} as const;

export type SkillCard = {
  title: string;
  body: string;
  /** Matches a key in the image map at the top of Skills.astro. */
  image: 'committee' | 'emcee' | 'event' | 'drawing';
  imageAlt: string;
};

/**
 * Section 5. Image-and-text cards — what I actually offer a committee.
 */
export const skills = {
  heading: 'What I bring to a committee.',
  lede: 'Four things, in roughly the order they get needed.',
  cards: [
    {
      title: 'Run sheets that hold',
      body: 'A schedule is a promise to everyone working the day. I write them so the next person can pick one up cold and know what happens at 14:20.',
      image: 'committee',
      imageAlt: 'The orientation organising committee',
    },
    {
      title: 'Publicity that fills rooms',
      body: 'Knowing who the event is actually for, then reaching them where they already are. Attendance is the only metric that settles the argument.',
      image: 'event',
      imageAlt: 'Orientation running on the day',
    },
    {
      title: 'A steady hand on the mic',
      body: 'Emceeing, briefing, and keeping an hour moving when a segment overruns. Publicity gets people seated; someone still has to run the room.',
      image: 'emcee',
      imageAlt: 'Emceeing Industry Connect 2026',
    },
    {
      title: 'Recovery when it slips',
      body: 'Every programme overruns somewhere. The useful skill is deciding fast what gets cut, and making that look like it was always the plan.',
      image: 'drawing',
      imageAlt: 'An orientation activity in progress',
    },
  ] satisfies SkillCard[],
} as const;
