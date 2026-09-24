import type { ImageMetadata } from 'astro';

/**
 * One card in a horizontal track.
 *
 * Projects renders this shape through TrackSection. `specs` is a free-form list
 * rather than fixed fields, so a card can carry role / stack / year / outcome
 * or whatever rows suit it.
 *
 * Rows render in the order given. Four is the number the card is designed for;
 * more will fit but the card grows taller, and the track is height-capped.
 */
export type TrackItem = {
  name: string;
  blurb: string;
  image: ImageMetadata;
  imageAlt: string;
  specs: { label: string; value: string }[];
};
