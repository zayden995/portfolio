import type { ImageMetadata } from 'astro';

/**
 * One card in a horizontal track.
 *
 * Involvements and Projects both render this shape through the same component,
 * which is why `specs` is a free-form list rather than fixed fields: an event
 * wants role / organisation / year / outcome, a project wants role / stack /
 * year / outcome, and neither has to know about the other.
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
