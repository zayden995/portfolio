# Cinematic single-page portfolio — design

Date: 2026-09-16
Status: approved, pending implementation plan

## Context

`portfolio/` holds a working five-page Astro site (index, about, involvements,
projects, contact), pushed to `github.com/zayden995/portfolio`. Alongside it,
`portfolio-mockup/index.html` is a single-file scroll study built after
jeskojets.com — espresso/cream inversion, Archivo on its width axis, GSAP
ScrollTrigger with a pinned horizontal track.

The mockup is the design that wins. This spec rebuilds the Astro site as a
single-page, anchor-scrolled version of it.

## Decisions taken

| Question | Decision |
| --- | --- |
| Stack | Astro 7 in place. Not Next.js. |
| Structure | Single page. The five routes collapse into seven sections. |
| Palette | Espresso/cream inversion per section. No third hue. |
| Work content | Two tracks — events and technical projects — from one array. |
| Mockup folder | Deleted only after the rebuild is verified. |
| Existing repo | Rebuilt on branch `cinematic-rebuild`; `main` untouched. |

### Why Astro rather than Next.js

The original brief named Next.js but invited a counter-proposal. The target is
already an Astro 7 repo carrying Tailwind 4.3.3, GSAP 3.15 and React 19 — most
of the dependency list, already installed. Rebuilding in place keeps the git
history, the remote and the deploy. Astro also ships zero JS for static
sections, which suits a page whose weight is imagery and scroll work.

## Stack

Installed already: `astro@7`, `@astrojs/react`, `react@19`, `tailwindcss@4.3.3`,
`gsap@3.15`.

To add: `lenis@1.3.x`, `motion@13.3.x` (the current package name for Framer
Motion; imports resolve from `motion/react`).

To remove: `animejs`, `@react-spring/web` — superseded by the GSAP/Framer split
below, and unused once the old pages go.

GSAP 3.15's public npm package includes ScrollTrigger, SplitText and CustomEase.
Verified against the registry; no Club licence required.

## Motion architecture

One rule decides which library owns an effect:

**If it is scrubbed to scroll position, it is GSAP. Otherwise it is Framer Motion.**

GSAP + ScrollTrigger, initialised from a single module and run from one
`<script>` in the layout:

- hero parallax — three layers at three rates, scrubbed
- the pinned horizontal work tracks
- the pinned index scrub in Reach
- the full-bleed moment's scale and drift
- `SplitText` line reveals on headings, `[data-reveal]` entrances
- counters, and the candidature blueprint draw-on

Framer Motion, only inside the React islands that already exist for state
reasons — `Nav` (mobile menu, hover) and `ContactForm` (field focus, submit
state). No React is shipped for static sections.

Lenis drives ScrollTrigger rather than running beside it: `lenis.on('scroll',
ScrollTrigger.update)` and `gsap.ticker.add(t => lenis.raf(t * 1000))` with
`lagSmoothing(0)`. Anchor links route through `lenis.scrollTo` or they fight the
smoothing.

### Reduced motion

Carried over from the mockup, and non-negotiable:

> Nothing is hidden in CSS. Every from-state is set by JS, and only when motion
> is allowed.

With JS off, or `prefers-reduced-motion: reduce`, the page at rest is the
complete page — not a stack of invisible sections. This replaces the existing
site's `.js` class marker, which does the opposite.

Nav theme inversion is exempt and always runs: it is legibility, not decoration.

## Sections

Seven sections, alternating theme. Nav carries five anchors.

| # | id | Theme | Content |
| --- | --- | --- | --- |
| 1 | `hero` | espresso | Name, three-line statement, intro, scroll cue, parallax portrait, four-cell spec footer |
| 2 | `statement` | cream | One positioning sentence, four animated counters |
| 3 | `about` | espresso | Bio, four value pillars, candidature spec table, blueprint SVG with NOW marker |
| 4 | `work` | cream | **Centrepiece.** Full-bleed moment, then two pinned horizontal tracks |
| 5 | `skills` | espresso | Image-and-text cards |
| 6 | `reach` | cream | Pinned index scrub over 14 entries, live Singapore clock, city list |
| 7 | `contact` | espresso | Form, email and socials, colophon |

Nav anchors: About, Work, Skills, Reach, Contact. Statement is scrolled through,
not linked — it is the beat between hero and about.

The candidature spec table and blueprint fold into About rather than standing
alone, to hold the nav at five anchors.

The full-bleed moment is new and has no mockup equivalent: a 100svh image with
scrubbed scale and one overlaid line, introducing Work. The brief asks for a
dramatic full-viewport beat; the hero alone reads as a hero, not as jesko's
full-screen aircraft.

The Reach clock is a few lines of inline script, not a React island — Astro
renders a static `--:--` server-side and the script fills it in and ticks from
there, so the markup never depends on the server's clock or timezone.

## Data layer

`src/data/` is the content layer, and nothing editable lives outside it. Four
files, split by concern rather than one monolith — the brief asked for one file,
but the repo already splits this way and its README documents the split, so
matching the existing convention beats imposing a new one:

| File | Holds |
| --- | --- |
| `site.ts` | Name, course, location, email, socials, nav anchors, hero statement |
| `work.ts` | Both tracks — events and technical projects |
| `about.ts` | Bio, the four pillars, candidature spec rows, skills cards |
| `involvements.ts` | The 14-entry index that Reach scrubs through |

`site.ts` and `involvements.ts` are kept and adapted; `about.ts` is rewritten
(its current shape is skill groups and education); `work.ts` is new and absorbs
`projects.ts`, which is removed.

Both tracks come from one array with a discriminant, so one card component
serves both:

```ts
export type WorkItem = {
  kind: 'event' | 'project';
  name: string;
  blurb: string;
  image: ImageMetadata;
  imageAlt: string;
  /** Rendered as the spec table. Events: role/scale/year/outcome.
      Projects: role/stack/year/outcome. */
  specs: { label: string; value: string }[];
};
```

Adding a project is one array entry. No component is touched.

## Design tokens

Replacing the current monochrome-on-black system in `src/styles/global.css`.

```
--espresso: #312726
--cream:    #fff8ed
--stone:    #7a716e
```

No third hue. The inversion between sections is the accent. Each section sets
its own `--bg`/`--fg` pair via a theme class, so one class themes everything
inside it.

Type: Archivo, one family across its width axis — 125/700 display, 112 body,
100 tracked uppercase for meta. This mirrors jesko's GT America
Extended/Regular relationship. It replaces the current Erode/Switzer pairing.

Loading moves from Fontshare to a self-hosted Archivo variable font via
`@font-face` with `font-display: swap`, removing two render-blocking
third-party stylesheets.

Webfonts change line breaks, which changes every SplitText measurement —
`document.fonts.ready` must trigger `ScrollTrigger.refresh()`.

## Responsive

Breakpoint at 861px, matching the mockup:

- Above: horizontal tracks pin and scroll sideways; index scrub pins.
- Below: tracks become vertical stacks; index rows light up on their own as they
  arrive; hero portrait moves behind the headline at 0.2 opacity; scroll cue
  hides.

Pinned sideways scrolling on a phone fights the thumb, so it is desktop-only.
Handled with `gsap.matchMedia()`, which cleans up its own triggers on resize.

## Images

Seven real photographs exist in `public/photos/` (current filenames contain
spaces and should be slugged during the move). They move into `src/assets/` so
Astro's `<Image />` can process them — AVIF/WebP with automatic `width`/`height`
and lazy loading below the fold. The hero portrait is eager, everything else
lazy.

The technical projects track has no real assets. It ships lightweight generated
placeholders and `[PROJECT 1]`-style copy, clearly marked.

## Contact form

Stubbed. It validates, then says on screen that nothing was sent. A single
`FORM_ENDPOINT` constant switches it on for Formspree, Basin or similar. The
direct email and social links work already.

## Removed

`src/pages/{about,involvements,projects,contact}.astro`, `PageHeader.astro`,
`RoundCarousel.tsx`, `InvolvementGroup.astro`, `src/lib/reflect.ts` (the WebGL
caustic field belongs to the black theme and has no place in the espresso one),
`src/data/projects.ts`.

**Deleting `reflect.ts` destroys the uncommitted pointer-strength tweak.** That
edit exists only in the working tree — it is not on `main`, and a working tree is
shared across branches, so branching did not preserve it. It must be committed
before `reflect.ts` is deleted, or it is gone. This is the first step of the
implementation plan, not an afterthought.

## Verification

Before this is called done:

- `npm run build` clean, which includes `astro check` (types)
- dev server runs with no console errors
- checked at 390px and 1440px
- smooth scroll, pinned track and index scrub all work
- `prefers-reduced-motion: reduce` renders the complete page at rest
- content swappable from the data files without touching components

Only then is `portfolio-mockup/` deleted.

## Deferred

- Wiring the contact form to a real endpoint
- Setting `site:` in `astro.config.mjs` to the real domain
- Real content for the technical projects track
- Unit tests — the pure helpers (spec shaping, clock formatting) could take
  Vitest; the CSS should not be unit-tested
