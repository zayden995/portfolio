/**
 * The Projects section — the horizontal track of technical work.
 *
 * One TrackItem per card, rendered by TrackSection. The images
 * here are generated placeholders; when you write a real entry, drop a
 * screenshot into src/assets/photos/ and import it in place of the placeholder.
 * Delete a placeholder jpg once nothing imports it.
 */

import type { TrackItem } from './types';

import project01 from '../assets/placeholders/project-01.jpg';
import project02 from '../assets/placeholders/project-02.jpg';
import project03 from '../assets/placeholders/project-03.jpg';

export const projectsTrack = {
  heading: 'Things I have built.',
  lede: 'Coursework and side projects. Every entry below is a placeholder awaiting real content.',
} as const;

/** The eyebrow printed at the top of every card in this track. */
export const projectsEyebrow = 'Project';

export const projects: TrackItem[] = [
  {
    name: '[PROJECT 1]',
    blurb:
      '[One or two sentences on what this project is and the problem it solves. Keep it to about thirty words — the card is narrow.]',
    image: project01,
    imageAlt: '[Describe the screenshot or visual for project 1]',
    specs: [
      { label: 'Role', value: '[Solo / team of 4]' },
      { label: 'Stack', value: '[Python, Pandas, scikit-learn]' },
      { label: 'Year', value: '[2026]' },
      { label: 'Outcome', value: '[What shipped, or what it scored]' },
    ],
  },
  {
    name: '[PROJECT 2]',
    blurb:
      '[One or two sentences on what this project is and the problem it solves. Keep it to about thirty words — the card is narrow.]',
    image: project02,
    imageAlt: '[Describe the screenshot or visual for project 2]',
    specs: [
      { label: 'Role', value: '[Your role]' },
      { label: 'Stack', value: '[Tools used]' },
      { label: 'Year', value: '[2026]' },
      { label: 'Outcome', value: '[What shipped]' },
    ],
  },
  {
    name: '[PROJECT 3]',
    blurb:
      '[One or two sentences on what this project is and the problem it solves. Keep it to about thirty words — the card is narrow.]',
    image: project03,
    imageAlt: '[Describe the screenshot or visual for project 3]',
    specs: [
      { label: 'Role', value: '[Your role]' },
      { label: 'Stack', value: '[Tools used]' },
      { label: 'Year', value: '[2026]' },
      { label: 'Outcome', value: '[What shipped]' },
    ],
  },
];
