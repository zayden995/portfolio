/**
 * Section 6 — Reach.
 *
 * The index is every committee, organisation and event in the order they
 * happened. On desktop the section pins and the list fills in as you scroll;
 * below 861px each row lights up on its own as it arrives. Either way the
 * counter is derived from the array length, so adding a row needs no other
 * edit.
 */

export type IndexEntry = {
  year: string;
  name: string;
  /** The organisation, or the role held. Shown right-aligned. */
  note: string;
};

export const experiences = {
  heading: 'The whole list.',
  lede: 'Every committee, organisation and event, in the order they happened.',
} as const;

export const indexEntries: IndexEntry[] = [
  { year: '2012', name: 'Chong Hua Tong Tou Teck Hwee', note: 'Member & volunteer' },
  { year: '2025', name: 'School of Computing Club', note: 'Admin Subcommittee' },
  { year: '2025', name: 'Movie Night', note: 'SOCC' },
  { year: '2025', name: 'Shirt Sales', note: 'SOCC' },
  { year: '2025', name: 'Sustainability Hackathon', note: 'SOCC' },
  { year: '2026', name: 'School of Computing Ambassadors', note: 'Publicity Subcommittee' },
  { year: '2026', name: 'SP Open House', note: 'SOCA' },
  { year: '2026', name: 'DSTA BrainHack', note: 'SOCA' },
  { year: '2026', name: 'Vice-Head of Publicity', note: 'SOCA' },
  { year: '2026', name: 'SPxHP Workshop', note: 'SOCA' },
  { year: '2026', name: 'Industry Connect', note: 'SOCA' },
  { year: '2026', name: 'Hearts & Homies', note: 'SOCC' },
  { year: '2026', name: 'Project Head', note: 'SOCC' },
  { year: '2026', name: 'Freshman Orientation Camp', note: 'SOCC' },
];
