# My commitments — design

Date: 2026-09-25 · Status: approved and implemented 2026-09-25 (uncommitted).
A snapshot of the decision — `README.md` and `HANDOFF.md` describe the site as it is.

Preview the design was approved from: https://claude.ai/artifact/PDztunwcSdAXSFjXv3wUAv
(version 3; ⅔ screen per photo)

## Goal

Replace the Involvements track and the Experiences index with one section,
**My commitments**, which tells the story by organisation: School of Computing
Club, School of Computing Ambassadors, and Chong Hua Tong Tou Teck Hwee. Each
opens on a group photograph; its events then play through a held photo frame
with each event's details opening beside the list.

Alongside it: rename About's heading and reorder the page.

## What Zayden asked for, and what is assumed

Asked for:

- "The short version." → "About me."
- A section called My commitments listing SOCC, SOCA and the temple, each with
  its events, with pictures appearing as it is scrolled
- The sticky-stage layout (preview option A) with the chapter openers from
  option B, and a longer scroll per photo: ⅔ of a screen
- This section replaces Involvements; each event shows a dropdown of details
  as it is scrolled through
- Placeholders for anything not yet supplied

Assumed, and confirmed in conversation:

- The Experiences list's real entries seed the events and roles
- Nav label "Commitments", anchor `#commitments`
- Involvements' opening beat is deleted with the section; recoverable from git
  at `a7e0958`

## Page order and themes

| # | Section | id | Theme | Change |
| --- | --- | --- | --- | --- |
| 1 | Hero | `hero` | espresso | — |
| 2 | About me | `about` | **cream** | was espresso; heading renamed |
| 3 | My commitments | `commitments` | espresso | new; replaces Involvements and Experiences |
| 4 | Statement | `statement` | cream | moved from 2nd to 4th |
| 5 | Skills | `skills` | **espresso** | was cream |
| 6 | Contact | `contact` | **cream** | was espresso |

Nav: About · Commitments · Skills · Contact.

Projects stays hidden. Its restore note in `index.astro` changes: Projects is
a dark section, and Skills is now dark too, so restoring it means re-theming
rather than only flipping Contact.

## The section

### Structure

```
section#commitments.sec.t-dark.commit-sec
  header        "My commitments." + meta line derived from data
                ("Three organisations · since 2012")
  for each commitment
    .cm-open    group photo opener, name / since / roles over it
    .cm-run     the chapter's events
      .cm-view  list of events (left) + frame, caption, progress line (right)
        .cm-row per event: year · name · photo count
          .cm-detail   blurb + spec list
          .cm-photos   the event's photos
```

### At rest — no JS, reduced motion, phones, short screens

The markup is the complete page, stacked in one column:

- Each opener is a large photograph block with the commitment's name, start
  year and roles set over it
- Every event row shows its details open and its photos underneath
- An event with no photos simply has none shown
- Nothing is hidden in CSS

On phones and short screens with motion allowed, the openers also **grow** as
they scroll in (a small window opening out to the full frame) and each photo
rises in with the same tween `data-reveal` uses. That tween is applied from this
mode's matchMedia context, not by putting `data-reveal` on the photos, because
`data-reveal` runs in every mode and would fight the staged layout. Nothing
holds the page.

### Staged — desktop, motion allowed

Gate: `(min-width: 861px) and (min-height: 720px)`. `motion.ts` adds
`.is-staged` to the section; every rule for the held layout is scoped under it,
so removing the class returns the rest layout.

**Opener.** The wrapper is `100svh × (1 + hold)` tall with a sticky 100svh view
inside. As it scrolls in, the frame's clip opens from
`inset(22% 28%)` to `inset(0)` and the photo settles from scale 1.25 to 1.04;
the title fades up in the last third. It then holds for `hold` screens while the
photo settles the rest of the way to 1. The frame starts below the nav bar so
the cream nav always sits on espresso, never on a bright photograph.

**Run.** The wrapper is `100svh × (1 + beats × hold)` tall, where `beats` is
the chapter's photo count (an event with no photos counts as one beat). Inside,
a sticky 100svh view holds the list on the left and the frame on the right.

As the run scrolls, one ScrollTrigger (no pin; `start: top top`,
`end: bottom bottom`) maps progress to a beat:

- The current event's row is lit; rows already shown are half-lit; later rows
  are dim. Only the row's text dims, never its photos
- The current event's **details drop open** under its name (grid rows
  `0fr → 1fr`, then the content fades up); the previous event's close
- The frame shows the beat's photo, wiping up over the last one. The photo
  settles from scale 1.08 to 1 across its beat, and a hairline under the frame
  fills with it
- An event with several photos steps through them; ticks under its name show
  which one
- The caption reads `SOCC · Hearts & Homies` / `2026 · 1 / 2`
- An event with no photo shows its commitment's group photo in the frame; with
  no group photo either, a marked `[PHOTO]` placeholder field

**One knob:** `--commit-hold: 0.67` on `.commit-sec` sets both the opener hold
and the per-photo length, in screens.

**Photos are rendered once.** Each event's photos live inside its row. In the
staged layout they are absolutely positioned onto the frame's rectangle, which
is defined by CSS variables shared with the frame, caption and progress line,
so the two cannot drift apart. The containing block is the sticky view, so
nothing between the view and the photos may be positioned or transformed. The
fallback group photo is the only duplicated image. It is rendered once per
chapter, staged-only, with an empty alt.

**Fit.** The list with one event's details open must fit the held view. It is
sized for SOCC's five events at 1280×720. A chapter with many more events would
need a taller gate; this goes in HANDOFF as something to watch.

## Content — `src/data/commitments.ts`

Replaces `experiences.ts` and `involvements.ts`.

```ts
type Photo = { src: ImageMetadata; alt: string };

type CommitmentEvent = {
  name: string;
  year: string;
  blurb: string;
  specs: { label: string; value: string }[];
  photos: Photo[];
};

type Commitment = {
  name: string;
  short: string;   // SOCC, SOCA, Temple — used in captions and meta
  since: string;
  roles: string[]; // shown in order, joined with →
  group: Photo | null;
  events: CommitmentEvent[];
};
```

Seeded as follows. Every blurb is `[PLACEHOLDER]` copy; every event's specs are
`Role / Scale / Outcome` with bracketed placeholder values.

| Commitment | Since | Roles | Group photo | Events (photos) |
| --- | --- | --- | --- | --- |
| School of Computing Club · SOCC | 2025 | Admin Subcommittee → Project Head | `foc-committee` | Movie Night 2025, Shirt Sales 2025, Sustainability Hackathon 2025, Hearts & Homies 2026 (`hearts-and-homies`), Freshman Orientation Camp 2026 (`foc-event`, `foc-drawing`) |
| School of Computing Ambassadors · SOCA | 2026 | Publicity Subcommittee → Vice-Head of Publicity | none | SP Open House 2026, DSTA BrainHack 2026, SPxHP Workshop 2026, Industry Connect 2026 (`industry-connect`, `industry-connect-emcees`, `industry-connect-emcees-2`) |
| Chong Hua Tong Tou Teck Hwee · Temple | 2012 | Member & volunteer | none | `[EVENT 1]`, `[EVENT 2]`, `[EVENT 3]`, year `[YEAR]` |

A missing group photo renders a hatched field labelled `[GROUP PHOTO]` behind
the title, so it reads as unfinished rather than broken.

Photos go through `astro:assets` `<Image>` like every other photo on the page.

## Removed

- `src/components/sections/Involvements.astro`, `src/data/involvements.ts`
- `src/components/sections/Experiences.astro`, `src/data/experiences.ts`
- `TrackSection`'s `intro` prop and its markup
- `motion.ts`: the opening-beat branch of the track code, both Experiences
  blocks and their media-query constants
- `global.css`: `.track-intro*` (including its mobile and reduced-motion
  overrides) and the Reach / `.index-*` block

Kept: `TrackSection`, `TrackCard` and `TrackItem`, which the hidden Projects
section still uses. The track code's no-intro branch stays as it is.

## Other edits

- `about.ts`: heading → `About me.`
- `About.astro` → `t-light`; `Skills.astro` → `t-dark`; `Contact.astro` → `t-light`
- `index.astro`: new order; Projects restore note rewritten
- `site.ts`: nav items; the content-layer comment lists `commitments.ts`
- `types.ts`, `projects.ts`: comments that name Involvements

## Verification

- `npm run build` (`astro check && astro build`) clean
- Real browser, isolated headless Chrome, at 1440×900, 1280×720 and 390×844,
  and with `prefers-reduced-motion: reduce`:
  - no console errors, no horizontal overflow
  - all four nav anchors resolve and scroll
  - the nav stays legible over every opener and across every theme boundary
  - staged: stepping with `mouse.wheel` (not `scrollTo`) moves through every
    beat; the photo, details, ticks, caption and hairline follow; the list with
    details open fits the view at 1280×720
  - at rest: every detail and photo visible
  - About, Skills and Contact read correctly in their new themes, including the
    blueprint drawing and the contact form
- Screenshots use `caret: 'initial'`
- Dev server stopped afterwards; port 4321 free

## Docs

`README.md` and `HANDOFF.md` updated in the same change, per `CLAUDE.md`.
Nothing is committed or pushed unless Zayden asks.
