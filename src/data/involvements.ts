/**
 * The Involvements section — the horizontal track of events.
 *
 * Every entry below is a placeholder awaiting real copy. The photographs are
 * real, so the track looks like the finished thing while you write: replace the
 * name, blurb and spec values, and leave `image` alone unless you are swapping
 * the picture too.
 *
 * Adding an event is one entry here. No component is touched.
 */

import type { TrackItem } from './types';

import focCommittee from '../assets/photos/foc-committee.jpg';
import focEvent from '../assets/photos/foc-event.jpg';
import focDrawing from '../assets/photos/foc-drawing.jpg';
import industryConnect from '../assets/photos/industry-connect.jpg';
import industryConnectEmcees from '../assets/photos/industry-connect-emcees.jpg';
import heartsAndHomies from '../assets/photos/hearts-and-homies.jpg';

export const involvementsTrack = {
  heading: 'Rooms that had to be filled.',
  lede: 'Events planned, publicised, or run — and what each one actually took.',
  /**
   * Shown over the opening photograph, which is the first entry's own picture
   * blown up to fill the screen before it contracts back into its card.
   */
  introLine: 'Planning is the easy half.',
} as const;

/** The eyebrow printed at the top of every card in this track. */
export const involvementsEyebrow = 'Event';

export const involvements: TrackItem[] = [
  {
    name: '[EVENT 1]',
    blurb:
      '[One or two sentences on what this event was and what you actually did on it. Keep it to about thirty words — the card is narrow.]',
    image: focCommittee,
    imageAlt: 'The orientation organising committee',
    specs: [
      { label: 'Role', value: '[Your role]' },
      { label: 'Organisation', value: '[SOCC / SOCA]' },
      { label: 'Year', value: '[AY26/27]' },
      { label: 'Outcome', value: '[What it achieved]' },
    ],
  },
  {
    name: '[EVENT 2]',
    blurb:
      '[One or two sentences on what this event was and what you actually did on it. Keep it to about thirty words — the card is narrow.]',
    image: focEvent,
    imageAlt: 'Orientation running on the day',
    specs: [
      { label: 'Role', value: '[Your role]' },
      { label: 'Scale', value: '[How many people]' },
      { label: 'Year', value: '[AY26/27]' },
      { label: 'Outcome', value: '[What it achieved]' },
    ],
  },
  {
    name: '[EVENT 3]',
    blurb:
      '[One or two sentences on what this event was and what you actually did on it. Keep it to about thirty words — the card is narrow.]',
    image: industryConnect,
    imageAlt: 'Industry Connect participants',
    specs: [
      { label: 'Role', value: '[Your role]' },
      { label: 'Organisation', value: '[SOCC / SOCA]' },
      { label: 'Year', value: '[2026]' },
      { label: 'Outcome', value: '[What it achieved]' },
    ],
  },
  {
    name: '[EVENT 4]',
    blurb:
      '[One or two sentences on what this event was and what you actually did on it. Keep it to about thirty words — the card is narrow.]',
    image: industryConnectEmcees,
    imageAlt: 'Emceeing at Industry Connect',
    specs: [
      { label: 'Role', value: '[Your role]' },
      { label: 'Organisation', value: '[SOCC / SOCA]' },
      { label: 'Year', value: '[2026]' },
      { label: 'Outcome', value: '[What it achieved]' },
    ],
  },
  {
    name: '[EVENT 5]',
    blurb:
      '[One or two sentences on what this event was and what you actually did on it. Keep it to about thirty words — the card is narrow.]',
    image: heartsAndHomies,
    imageAlt: 'A club social',
    specs: [
      { label: 'Role', value: '[Your role]' },
      { label: 'Organisation', value: '[SOCC / SOCA]' },
      { label: 'Year', value: '[2026]' },
      { label: 'Outcome', value: '[What it achieved]' },
    ],
  },
  {
    name: '[EVENT 6]',
    blurb:
      '[One or two sentences on what this event was and what you actually did on it. Keep it to about thirty words — the card is narrow.]',
    image: focDrawing,
    imageAlt: 'An orientation activity in progress',
    specs: [
      { label: 'Role', value: '[Your role]' },
      { label: 'Organisation', value: '[SOCC / SOCA]' },
      { label: 'Year', value: '[AY26/27]' },
      { label: 'Outcome', value: '[What it achieved]' },
    ],
  },
];
