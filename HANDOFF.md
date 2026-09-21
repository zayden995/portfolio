# Handoff — Zayden Chua portfolio

Last updated: 2026-09-22

> **Update this file and `README.md` after every relevant change**, in the same
> task, before calling the work done. `CLAUDE.md` defines what counts as
> relevant. This file is the record; the README is the manual.

---

## The goal

A personal portfolio site for **Zayden Chua**, a second-year Information
Technology student at Singapore Polytechnic (Applied AI & Data Analytics,
Apr 2025 — Apr 2028).

The site exists to show **what he does outside class** — running events and
publicity for two School of Computing student groups, and volunteering with a
temple community he has belonged to since 2012. It is not a freelancer
portfolio and does not advertise availability for work.

The current direction is a **single-page, cinematic scroll site modelled on
jeskojets.com**: dark and light sections inverting, large extended display type,
photography carrying the page, and slow, settled scroll-driven motion.

---

## Current state

**Working, uncommitted, on branch `cinematic-rebuild`.** `main` is untouched.

Build is clean (`astro check`: 0 errors, 0 warnings, 0 hints). Verified in a
real browser at 1440×900, 1280×720 and 390×844, and with
`prefers-reduced-motion: reduce`: no console errors, no horizontal overflow,
nothing stuck invisible, all six nav anchors resolve and scroll.

```
cinematic-rebuild  (branched from main, nothing committed yet)
main
  d91fbd1  Rebuild the theme in monochrome, restore Projects, lift type scale
  0477a3a  Rebuild portfolio around student profile and deep blue theme
  2512295  initial portfolio setup
```

The entire rebuild is **staged and ready to commit** — 52 paths: 19 new, 13
modified, 12 deleted and 8 renamed (the photos, moved from `public/photos/` to
`src/assets/photos/` with slugged names, byte-identical). Nothing is committed
yet; that commit is the first thing to do before any further work.

`src/lib/reflect.ts` was **deleted** as part of staging: the WebGL water field
from the previous design, unimported since the rebuild. Its last committed form
is at `d91fbd1`; the working-tree tweak it carried (pointer interaction off,
+23/−14) was discarded deliberately and is gone.

### Stack

| Package | Version | Used for |
| --- | --- | --- |
| Astro | 7.2 | Static single page, islands |
| React | 19.2 | Two islands only: `Nav`, `ContactForm` |
| Tailwind CSS | 4.3 | Tokens via `@theme`, some utilities |
| GSAP (ScrollTrigger, SplitText, CustomEase) | 3.15 | All scroll-driven motion |
| Lenis | 1.3 | Smooth scrolling, driving ScrollTrigger |
| Motion (Framer Motion) | 13.3 | Mobile nav panel, form feedback |

Removed in this rebuild: `animejs`, `@react-spring/web`.

GSAP 3.15's public npm package includes SplitText and CustomEase — no Club
licence needed.

### Page structure

One page, `src/pages/index.astro`. Sections in order, with their theme:

| Section | id | Theme | In nav | Content |
| --- | --- | --- | --- | --- |
| Hero | `hero` | espresso | — | Statement, intro, portrait, four facts, scroll cue |
| Statement | `statement` | cream | — | One sentence, four animated counters |
| About | `about` | espresso | ✓ | Bio, four pillars, candidature table + blueprint drawing |
| Involvements | `involvements` | cream | ✓ | Opening photo beat, then the pinned events track |
| Experiences | `experiences` | espresso | ✓ | Pinned index scrub of 14 entries |
| Skills | `skills` | cream | ✓ | Four image-and-text cards |
| Projects | `projects` | espresso | ✓ | Technical work track (placeholders) |
| Contact | `contact` | cream | ✓ | Form, WhatsApp/email/socials, local time, based in |

Themes must alternate. **Reordering sections means re-checking the theme of
each one** — two adjacent sections of the same theme lose their boundary.

### Design system

All tokens live at the top of `src/styles/global.css`.

- **Palette:** espresso `#312726`, cream `#fff8ed`, stone `#7a716e`. No third
  hue — the inversion between sections is the accent. Each section takes
  `.t-dark` or `.t-light`, which set `--bg`, `--fg`, `--mut`, `--rule`, `--field`
- **Type:** Archivo, one family across its width axis — `wdth 125 / wght 700`
  for display, `wdth 112` for body, `wdth 100` tracked uppercase for meta.
  Loaded from Google Fonts with the `wdth` axis requested explicitly
- **Scale:** `--d-xl`, `--d-l`, `--d-m`, `--d-s`, `--body`, `--meta`
- **Easing:** `--ease-cinematic: cubic-bezier(0.62, 0.05, 0.01, 0.99)`
- **Hero portrait knobs:** `--portrait-w` (size) and `--portrait-inset`
  (distance from the right edge), on `.hero`

---

## Files

### Content — edit these, not the components

| File | Holds |
| --- | --- |
| `src/data/site.ts` | Name, course, location, timezone, email, hero, nav, social links |
| `src/data/about.ts` | Statement + counters, bio, pillars, candidature, skills cards |
| `src/data/involvements.ts` | Events track: heading, lede, intro line, six events |
| `src/data/projects.ts` | Projects track: heading, lede, three projects |
| `src/data/experiences.ts` | Heading, lede, the 14-entry index |
| `src/data/types.ts` | `TrackItem` — the shared card shape. No content |

Adding an event or project is one array entry. Placeholders are in square
brackets: `grep -rn "\[" src/data/`

### Components

| File | Purpose |
| --- | --- |
| `src/components/TrackSection.astro` | One pinned horizontal track. Optional `intro` prop adds the opening photo beat |
| `src/components/TrackCard.astro` | One card: image, eyebrow, name, blurb, spec table |
| `src/components/sections/*.astro` | One file per section. `Involvements` and `Projects` are thin wrappers around `TrackSection` |
| `src/components/Nav.tsx` | React island. Six anchors, mobile panel, theme inversion |
| `src/components/ContactForm.tsx` | React island. Validates; **not wired to an endpoint** |

### Plumbing

| File | Notes |
| --- | --- |
| `src/layouts/BaseLayout.astro` | Head, font link, nav, single motion entry |
| `src/lib/motion.ts` | **All scroll motion.** Single entry: `initMotion()` |
| `src/styles/global.css` | Tokens, section themes, every component's CSS |
| `src/assets/photos/` | Eight real photos, slugged filenames, processed by `astro:assets` |
| `src/assets/placeholders/` | Three generated project placeholders |
| `README.md` | The manual: running, editing content, how the pieces work. Kept current |
| `CLAUDE.md` | Loaded by every Claude Code session started in this folder. Holds the rule to keep this file and the README current, and Zayden's working preferences under **Working with Zayden (Preferences)** |
| `docs/superpowers/specs/2026-09-16-cinematic-portfolio-design.md` | Original design spec for the rebuild — now partly out of date |

---

## What changed

### From five pages to one

The previous site (deep blue, then monochrome, Erode serif, five routes) was
rebuilt as a single anchor-scrolled page, porting a standalone design study
(`portfolio-mockup/index.html`) that had been built after jeskojets.com. That
mockup folder was **deleted** once the rebuild was verified; its seven photos
were byte-for-byte identical to ones already in the repo.

Deleted: `about`, `involvements`, `projects`, `contact` pages;
`PageHeader`, `RoundCarousel`, `InvolvementGroup`, `Section`, `ActionLink`,
`Footer`; `lib/animations.ts`; the old `involvements.ts` shape.

Next.js was the original brief. Astro was kept instead because the repo was
already Astro 7 with Tailwind 4 and GSAP, and rebuilding in place preserved git
history and the remote.

### Motion architecture

One rule: **scrubbed to scroll position → GSAP; everything else → Framer
Motion.** GSAP runs from one module; Framer Motion only appears inside the two
React islands. Lenis drives ScrollTrigger via the GSAP ticker rather than
running beside it.

What GSAP does: hero parallax (three layers, three rates), SplitText line
reveals, `data-reveal` entrances, counters, the blueprint draw-on, both pinned
tracks, the Involvements opening beat, and the Experiences index scrub.

### The Involvements opening beat

The section opens on **the first event card's own photograph at full viewport
size**, with "Planning is the easy half." over it. As the section pins, the
photo contracts onto the first card's exact rect while the heading rises beside
it; the overlay then dissolves in place, and the horizontal run begins.

It took three iterations to get right — see *What failed* for why:

1. A separate full-bleed section that pinned and contracted — landed at the
   right rect, but ~1 viewport of empty scroll followed it
2. Heading moved into that beat — composition fixed, but still two sections,
   so the photo scrolled off the top while the card rose from below: a
   ~990px gap
3. **Current:** the overlay lives *inside* the track's pinned viewport, one
   timeline for both phases. Measured gap: 0px

### Content and structure edits, in order

- Sections renamed: Work → **Involvements**, Reach → **Experiences**
- Event cards reset to `[EVENT 1–6]` placeholders, keeping the real photos
- Projects split out of Involvements into its own section, before Contact
- Tracks vertically centred while pinned
- Hero portrait moved up and in from the right edge
- Experiences and Skills swapped (themes flipped with them to keep alternation)
- Local time and location moved from Experiences to Contact; "Where" became
  "Based in", Singapore only; the city list was removed
- WhatsApp `zxyden` added above email, **deliberately unlinked** — WhatsApp
  usernames have no documented public link format. `href` is optional on
  `SocialLink`; add a `wa.me` link with a phone number to make it clickable
- Contact flipped to cream when Projects landed before it
- `README.md` rewritten for the single-page site, and `CLAUDE.md` added with a
  standing rule: this file and the README are updated after every relevant
  change. `CLAUDE.md` also records Zayden's working preferences

### Tried and reverted

- **A blue palette** read off a photo of trainers (navy / ice / slate, plus a
  blue duotone on all photos). Built fully, then reverted at the client's
  request. The site is back on espresso/cream with untreated photos
- **A scroll transformation on the hero itself.** Four options were built as a
  live comparison — https://claude.ai/artifact/4LucAUwBpjwgYmdgNq7uMR — then
  dropped. That idea was later applied to the Involvements opener instead

---

## What failed

Real traps. Most cost time and would cost it again.

### In the site

**A pinned section that doesn't fit the viewport loses its bottom half.** The
hero headline, the work cards' spec tables and the Experiences index all
overflowed at first. Fixed by resizing, and for Experiences by **gating the pin
on height** (`min-height: 860px`) — short screens get the progressive reveal
phones get, rather than crushed type.

**A track that doesn't overflow the screen still pinned.** Three project cards
fit a 1440px viewport, so the pin held scroll for zero horizontal distance and
the section looked stuck. Tracks now skip the pin when `distance() <= 0`.

**A match cut between two sections is not a handoff.** See the three
iterations above. Any "this becomes that" effect needs both elements inside the
same pinned container, or scrolling will separate them.

**The handoff showed the wrong photo.** The first full-bleed used `foc-event`
while card 1 used `foc-committee`, so the "seamless" landing would have swapped
pictures. The intro now takes its image from `items[0]` so the two cannot drift.

**The opener wasn't full-bleed.** The overlay covered the track viewport, which
the section's side padding inset by the gutter. The gutter now lives on
`.track-head` and `.track` instead, and `distance()` reads it from the track's
`padding-left`.

**A mobile override that never applied.** It was declared earlier in the
stylesheet than the rule it overrode; equal specificity, so the later rule won
at every width. **Overrides for `.track-intro` must stay below its definition.**

**The nav vanished over the dark overlay.** Involvements is a cream section, so
the nav turned espresso — over an espresso overlay. Fixed with an
`html.intro-dark` class toggled from the timeline, plus `onEnter`/`onEnterBack`,
because `onUpdate` only fires once progress moves. The class sits on `<html>`
because React rewrites the nav's own `className` on re-render.

**`containerAnimation` needs a tween, not a timeline.** The Involvements track
had to become one timeline to stay seamless, so it lost the per-card image
drift. It has a uniform counter-drift instead; Projects keeps the per-card one.

**`_jsxDEV is not a function` after file renames.** A stale Vite cache.
Fix: `rm -rf node_modules/.vite .astro`, then restart the dev server.

**React 19 deprecated `FormEvent`.** Use `SubmitEvent<HTMLFormElement>`.

### In the tooling

**Astro 7 daemonises `astro dev`.** A server started in the background keeps
running, and a second `npm run dev` exits immediately with "already running" —
which looks like a failure. Use `npx astro dev status` / `stop` / `logs`. If
port 4321 is still held after `stop`, find the PID with `netstat -ano` and kill
it.

**Playwright's default `caret: 'hide'` causes React hydration errors.** It
injects `style=""` into form inputs, which React then reports as a mismatch.
This looked like a site bug and wasn't. Always screenshot with
`caret: 'initial'`.

**Teleporting with `scrollTo` skips ScrollTrigger callbacks.** Tests that jump
to exact pin boundaries report states real scrolling never produces. Verify
callback-driven behaviour with `mouse.wheel`.

**Bash command substitution eats JavaScript template literals** inside
`node -e "..."`. A backtick-quoted `` `+=${...}` `` was silently replaced with
nothing, leaving `end: () => ,`. Write scripts to a file, or use string
concatenation.

**Git Bash has no `$TMPDIR` and no Python.** Use explicit scratch paths, and
Node for scripted edits.

### Carried over from the previous design — still true

- **Isolate any automated browser.** An earlier session's tooling attached to
  the client's real browser and killed their windows. This rebuild used
  `playwright-core` driving a separate headless Chrome, installed in a scratch
  directory rather than the project
- **Read `git status` codes, not just the file list.** Deleted files were once
  staged as additions and nearly got restored by a commit
- **Grep colour literals after bulk edits.** Generation artifacts have corrupted
  hex values before:
  `grep -o '#[0-9a-zA-Z]\{3,8\}' file.css | grep -v '^#[0-9a-fA-F]\{6\}$'`

---

## What should be done next

### 1. Commit the rebuild

Everything is staged on `cinematic-rebuild` but uncommitted. Commit before any
further changes.

The `reflect.ts` question this section used to carry is settled — the file is
deleted and staged as such. Build re-verified after removal: `astro check`
reports 0 errors, 0 warnings, 0 hints.

### 2. Real content

- `src/data/involvements.ts` — six `[EVENT n]` placeholders. The photos are real;
  replace name, blurb and spec values. The **first** entry's photo is also the
  opening beat's photo
- `src/data/projects.ts` — three `[PROJECT n]` placeholders with generated
  images. Swap in screenshots from `src/assets/photos/` and delete unused
  placeholder JPEGs

### 3. Before deploying

- **Set the real domain** in `astro.config.mjs` — `site:` is still
  `https://example.com`, so canonical URLs and OG tags are wrong
- **Connect the contact form.** Set `FORM_ENDPOINT` in `ContactForm.tsx`
  (Formspree, Basin, Netlify Forms). Until then it says plainly that nothing
  was sent
- **Make WhatsApp clickable**, if wanted — see the note in `site.ts`
- **Consent for photos of other people.** Several event photos show other
  students. If the repo is public, those faces are public and git history keeps
  them after deletion

### 4. Stale documentation

- The design spec in `docs/superpowers/specs/` describes the rebuild as first
  planned (a separate full-bleed section, "Work", "Reach") rather than as built.
  It is a snapshot of a decision, not a manual, so it is fine to leave as is —
  but do not treat it as current. `README.md` was rewritten for the single-page
  site on 2026-09-17

### 5. Things worth watching

- **Scroll held back to back.** The Involvements beat pins for about one
  viewport plus the track's horizontal distance. If it feels heavy, the intro
  length is `introLen = window.innerHeight` in `motion.ts`
- **Bundle.** ~463 KB JS uncompressed (~150 KB gzipped). React plus Motion is
  roughly two-thirds of that, for two small islands. Replacing both in vanilla
  would cut it sharply, at the cost of dropping Framer Motion from the stack
- **No-JS on desktop** shows the Involvements overlay covering its track and
  the tracks as clipped rows. Mobile and reduced motion both fall back to a
  full vertical stack correctly; no-JS desktop does not

---

## Conventions worth keeping

- **Docs move with the code.** After every relevant change, update this file
  and `README.md` in the same task. See `CLAUDE.md` for what counts
- **Content in `src/data/`, never in components.** If a change needs a
  component edit to add an item, the data shape is wrong
- **Nothing is hidden in CSS.** Every animated from-state is set by GSAP, and
  only when motion is allowed. With reduced motion the page at rest is the
  whole page
- **Measure, don't hard-code, positions that motion targets.** The opening
  beat reads the first card's rect from the DOM, with function values and
  `invalidateOnRefresh`, so changing card sizes moves the landing with it
- **Scroll distances are functions** paired with `invalidateOnRefresh`, so
  resizes and late-loading fonts recalculate rather than stranding content
- **`document.fonts.ready` → `ScrollTrigger.refresh()`.** Webfonts change line
  breaks, which changes every SplitText measurement and every pin distance
- **`overflow-x: clip`, not `hidden`, on `body`.** `hidden` turns the body into
  a scroll container and breaks pinning
- **Verify in a browser, not only with the build.** Nearly every bug above
  passed `astro check` cleanly
