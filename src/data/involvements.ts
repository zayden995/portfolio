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

import soccMcGroup from '../assets/photos/socc-mc-group.jpg';
import soccHeartsAndHomies from '../assets/photos/socc-hearts-and-homies.jpg';
import soccFocGroup from '../assets/photos/socc-foc-group.jpg';
import soccFocFlagMaking from '../assets/photos/socc-foc-flag-making.jpg';
import soccFocFlagWaving from '../assets/photos/socc-foc-flag-waving.jpg';

import socaMcGroup from '../assets/photos/soca-mc-group.jpg';
import socaOpenHouseGroup from '../assets/photos/soca-open-house-group.jpg';
import socaOpenHouseSelfie from '../assets/photos/soca-open-house-selfie.jpg';
import socaSpxhpGroup from '../assets/photos/soca-spxhp-workshop-group.jpg';
import socaSpxhpOcGroup from '../assets/photos/soca-spxhp-workshop-oc-group.jpg';
import socaIndustryConnectGroup from '../assets/photos/soca-industry-connect-group.jpg';
import socaIndustryConnectEmcees from '../assets/photos/soca-industry-connect-emcees.jpg';

import templeAcampGroup from '../assets/photos/temple-acamp-group.jpg';
import templeFtjdyGroup from '../assets/photos/temple-ftjdy-group.jpg';
import templePta12Apr from '../assets/photos/temple-pta-12-apr.jpg';
import templePta20Sep from '../assets/photos/temple-pta-20-sep.jpg';

export type Photo = {
  src: ImageMetadata;
  alt: string;
  /**
   * Which part of the photo stays in view when a frame crops it — a CSS
   * object-position, e.g. '50% 20%' (across, down). Omit for the centre.
   * Set with tools/crop-tool.html.
   */
  focus?: string;
};

export type CommitmentEvent = {
  name: string;
  /** The left-hand label: usually a year, but any short mark works — "01", "Annual". */
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
  /**
   * Replaces the "N events" count in the list's heading — for a commitment that
   * is better told as what it does than as a list of dated events. The entries
   * in `events` still work the same; their `year` is just a short label.
   */
  listLabel?: string;
  events: CommitmentEvent[];
};

export const involvementsSection = {
  heading: 'Involvements.',
} as const;

const BLURB =
  '[One or two sentences on what this event was and what you did on it. About thirty words.]';

const CATEGORY_BLURB =
  '[One or two sentences on what this is and what you do in it. About thirty words.]';

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
    group: { src: soccMcGroup, alt: 'The SOCC committee outdoors', focus: '50% 35%' },
    events: [
      { name: 'Movie Night', year: '2025', blurb: BLURB, specs: specs(), photos: [] },
      { name: 'Shirt Sales', year: '2025', blurb: BLURB, specs: specs(), photos: [] },
      { name: 'Sustainability Hackathon', year: '2025', blurb: BLURB, specs: specs(), photos: [] },
      {
        name: 'Hearts & Homies',
        year: '2026',
        blurb: BLURB,
        specs: specs(),
        photos: [{ src: soccHeartsAndHomies, alt: 'A club social' }],
      },
      {
        name: 'Freshman Orientation Camp',
        year: '2026',
        blurb: BLURB,
        specs: specs(),
        photos: [
          { src: soccFocGroup, alt: 'Orientation participants and facilitators in a lecture theatre', focus: '32% 50%' },
          { src: soccFocFlagMaking, alt: 'Two students drawing on a group flag' },
          { src: soccFocFlagWaving, alt: 'A team waving its flag outdoors during an orientation game' },
        ],
      },
    ],
  },
  {
    name: 'School of Computing Ambassadors',
    short: 'SOCA',
    since: '2026',
    roles: ['Publicity Subcommittee', 'Vice-Head of Publicity'],
    group: { src: socaMcGroup, alt: 'The SOCA committee' },
    events: [
      {
        name: 'SP Open House',
        year: '2026',
        blurb: BLURB,
        specs: specs(),
        photos: [
          { src: socaOpenHouseGroup, alt: 'The School of Computing Open House team in the atrium', focus: '38% 50%' },
          { src: socaOpenHouseSelfie, alt: 'Four Open House helpers in SOC shirts', focus: '33% 50%' },
        ],
      },
      { name: 'DSTA BrainHack', year: '2026', blurb: BLURB, specs: specs(), photos: [] },
      {
        name: 'SPxHP Workshop',
        year: '2026',
        blurb: BLURB,
        specs: specs(),
        photos: [
          { src: socaSpxhpGroup, alt: 'Workshop attendees and organisers in a lecture hall', focus: '0% 50%' },
          { src: socaSpxhpOcGroup, alt: 'The workshop organising committee in a function room', focus: '50% 37%' },
        ],
      },
      {
        name: 'Industry Connect',
        year: '2026',
        blurb: BLURB,
        specs: specs(),
        photos: [
          { src: socaIndustryConnectGroup, alt: 'The Industry Connect team on stage', focus: '44% 50%' },
          { src: socaIndustryConnectEmcees, alt: 'Two emcees at the podium at Industry Connect', focus: '50% 37%' },
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
    listLabel: 'What we do',
    events: [
      {
        name: 'Giving back to the community',
        year: '01',
        blurb: CATEGORY_BLURB,
        specs: [
          { label: 'Role', value: '[Your role]' },
          { label: 'Who it serves', value: '[Who it serves]' },
          { label: 'How often', value: '[How often]' },
        ],
        photos: [{ src: templeFtjdyGroup, alt: 'A group of temple volunteers in white polos in front of the shrine' }],
      },
      {
        name: 'Tutoring kids',
        year: '02',
        blurb: CATEGORY_BLURB,
        specs: [
          { label: 'Role', value: '[Your role]' },
          { label: 'Who it serves', value: 'Kids [age range]' },
          { label: 'Covers', value: 'Academic and moral' },
        ],
        photos: [
          { src: templePta12Apr, alt: 'Presenting a slide on the four key habits', focus: '29% 50%' },
          { src: templePta20Sep, alt: 'Presenting a slide on values in everyday life', focus: '0% 50%' },
        ],
      },
      {
        name: 'Annual events',
        year: '03',
        blurb: CATEGORY_BLURB,
        specs: [
          { label: 'Camps', value: 'A camp · B camp · C camp' },
          { label: 'Food fairs', value: '[Food fair names]' },
          { label: 'Role', value: '[Your role] (Facilitator at A camp)' },
        ],
        photos: [{ src: templeAcampGroup, alt: 'Facilitators and children holding painted badges at a camp', focus: '45% 50%' }],
      },
      {
        name: 'Overseas trips',
        year: '04',
        blurb: CATEGORY_BLURB,
        specs: [
          { label: 'Role', value: '[Your role]' },
          { label: 'Where', value: '[Where]' },
          { label: 'How often', value: '[How often]' },
        ],
        photos: [],
      },
    ],
  },
];
