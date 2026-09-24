/**
 * The Involvements section — three commitments (organisations) and what
 * happened in each. Each entry is one commitment, so the list and its type are
 * named `commitments` and `Commitment`.
 *
 * Each commitment opens on its group photo, then plays its events through a
 * held photo frame: one event at a time, its details open beside the list and
 * its photos stepped through in order. Below 861px wide, on short screens and
 * with reduced motion, the same content simply stacks.
 *
 * Adding an event is one entry in `events`. Adding a photo is one entry in its
 * `photos` — the scroll length grows with the photo count, so nothing else
 * needs changing. On desktop, an event with no photos shows a marked [PHOTO]
 * frame of its own until it has one.
 *
 * Anything in square brackets is a placeholder.
 */

import type { ImageMetadata } from 'astro';

import focCommittee from '../assets/photos/foc-committee.jpg';
import focEvent from '../assets/photos/foc-event.jpg';
import focDrawing from '../assets/photos/foc-drawing.jpg';
import heartsAndHomies from '../assets/photos/hearts-and-homies.jpg';
import industryConnect from '../assets/photos/industry-connect.jpg';
import industryConnectEmcees from '../assets/photos/industry-connect-emcees.jpg';
import industryConnectEmcees2 from '../assets/photos/industry-connect-emcees-2.jpg';

export type Photo = {
  src: ImageMetadata;
  alt: string;
};

export type CommitmentEvent = {
  name: string;
  year: string;
  /** About thirty words. Shown under the event's name when it is in the frame. */
  blurb: string;
  /** Free-form rows, in the order given. Three is what the list is sized for. */
  specs: { label: string; value: string }[];
  /** Shown in the frame one after another, in this order. */
  photos: Photo[];
};

export type Commitment = {
  name: string;
  /** Used in the frame's caption and the meta lines — SOCC, SOCA, Temple. */
  short: string;
  since: string;
  /** Shown in order, joined with arrows. */
  roles: string[];
  /** Opens the chapter. Leave null until you have one; a marked field shows instead. */
  group: Photo | null;
  events: CommitmentEvent[];
};

export const involvementsSection = {
  heading: 'Involvements.',
} as const;

const BLURB =
  '[One or two sentences on what this event was and what you did on it. About thirty words.]';

const specs = () => [
  { label: 'Role', value: '[Your role]' },
  { label: 'Scale', value: '[How many people]' },
  { label: 'Outcome', value: '[What it achieved]' },
];

export const commitments: Commitment[] = [
  {
    name: 'School of Computing Club',
    short: 'SOCC',
    since: '2025',
    roles: ['Admin Subcommittee', 'Project Head'],
    group: { src: focCommittee, alt: 'The orientation organising committee' },
    events: [
      { name: 'Movie Night', year: '2025', blurb: BLURB, specs: specs(), photos: [] },
      { name: 'Shirt Sales', year: '2025', blurb: BLURB, specs: specs(), photos: [] },
      { name: 'Sustainability Hackathon', year: '2025', blurb: BLURB, specs: specs(), photos: [] },
      {
        name: 'Hearts & Homies',
        year: '2026',
        blurb: BLURB,
        specs: specs(),
        photos: [{ src: heartsAndHomies, alt: 'A club social' }],
      },
      {
        name: 'Freshman Orientation Camp',
        year: '2026',
        blurb: BLURB,
        specs: specs(),
        photos: [
          { src: focEvent, alt: 'Orientation running on the day' },
          { src: focDrawing, alt: 'An orientation activity in progress' },
        ],
      },
    ],
  },
  {
    name: 'School of Computing Ambassadors',
    short: 'SOCA',
    since: '2026',
    roles: ['Publicity Subcommittee', 'Vice-Head of Publicity'],
    group: null,
    events: [
      { name: 'SP Open House', year: '2026', blurb: BLURB, specs: specs(), photos: [] },
      { name: 'DSTA BrainHack', year: '2026', blurb: BLURB, specs: specs(), photos: [] },
      { name: 'SPxHP Workshop', year: '2026', blurb: BLURB, specs: specs(), photos: [] },
      {
        name: 'Industry Connect',
        year: '2026',
        blurb: BLURB,
        specs: specs(),
        photos: [
          { src: industryConnect, alt: 'Industry Connect participants' },
          { src: industryConnectEmcees, alt: 'Emceeing at Industry Connect' },
          { src: industryConnectEmcees2, alt: 'Emceeing at Industry Connect' },
        ],
      },
    ],
  },
  {
    name: 'Chong Hua Tong Tou Teck Hwee',
    short: 'Temple',
    since: '2012',
    roles: ['Member & volunteer'],
    group: null,
    events: [
      { name: '[EVENT 1]', year: '[YEAR]', blurb: BLURB, specs: specs(), photos: [] },
      { name: '[EVENT 2]', year: '[YEAR]', blurb: BLURB, specs: specs(), photos: [] },
      { name: '[EVENT 3]', year: '[YEAR]', blurb: BLURB, specs: specs(), photos: [] },
    ],
  },
];
