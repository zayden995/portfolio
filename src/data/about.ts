/**
 * About-page content. Add, remove, or rename groups freely — the page renders
 * whatever is in these arrays.
 */

export type SkillGroup = {
  title: string;
  /** A short note on what this group is, shown under the heading. */
  note: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: 'Technical',
    note: 'What I am building and studying.',
    items: ['Full-stack web development', 'Programming', 'Software engineering'],
  },
  {
    title: 'Soft skills',
    note: 'Built by running events and working with people.',
    items: [
      'Leadership and coordination',
      'Event planning and execution',
      'Detail orientation',
      'Communication adaptability',
      'Publicity and campaign planning',
    ],
  },
];

export type EducationEntry = {
  period: string;
  qualification: string;
  institution: string;
  note: string;
  /** Positions held there, newest first. Optional. */
  roles?: string[];
};

export const education: EducationEntry[] = [
  {
    period: 'Apr 2025 — Apr 2028',
    qualification: 'Diploma in Information Technology',
    institution: 'Singapore Polytechnic',
    note: 'Specialising in Applied AI and Data Analytics.',
  },
  {
    period: '2021 — 2024',
    qualification: 'GCE O-Levels',
    institution: 'Hillgrove Secondary School',
    note: 'Where I first started taking on responsibility for other people.',
    roles: [
      'Section Leader, Concert Band (2023 — 2024)',
      'Vice-Chairman, Class (2023)',
      'Cyberwellness Ambassador, Class (2021 — 2022)',
    ],
  },
];
