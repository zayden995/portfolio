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

**Live, one commit behind.** The rebuild (`c995dda`) is on `origin/main` and
deployed. A second commit — the domain, the contact form, hiding Projects, the
cream opener and the card-image fix — is **committed locally and not yet
pushed**, so none of it is on the live site until it is.

Build is clean (`astro check`: 0 errors, 0 warnings, 0 hints).

The rebuild was verified in a real browser at 1440×900, 1280×720 and 390×844,
and with `prefers-reduced-motion: reduce`: no console errors, no horizontal
overflow, nothing stuck invisible, all six nav anchors resolve and scroll.
**The 2026-09-22 changes have not had that full pass.** Zayden confirmed the
cream opener and the card images look right on desktop; nobody has re-checked
them at phone width, with reduced motion, or with the contact form actually
submitting.

```
main  [ahead of origin/main by 1]
  (new)    Point the site at its real domain, wire the form, hide Projects
  c995dda  Rebuild the portfolio as a single cinematic scroll page
  d91fbd1  Rebuild the theme in monochrome, restore Projects, lift type scale
  0477a3a  Rebuild portfolio around student profile and deep blue theme
  2512295  initial portfolio setup
```

`c995dda` carries the whole rebuild — 52 paths: 19 new, 13 modified, 12 deleted
and 8 renamed (the photos, moved from `public/photos/` to `src/assets/photos/`
with slugged names; git recorded all eight at 100% similarity). It sits directly
on `d91fbd1`, so the merge into `main` was a fast-forward with no conflicts.

`src/lib/reflect.ts` was **deleted** in that commit: the WebGL water field from
the previous design, unimported since the rebuild. Its last committed form is at
`d91fbd1`; the working-tree tweak it carried (pointer interaction off, +23/−14)
was discarded deliberately and is gone.

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
| Contact | `contact` | espresso | ✓ | Form, WhatsApp/email/socials, local time, based in |

**Projects is hidden.** Its three entries are still `[PROJECT n]` placeholders,
so on 2026-09-22 the section was dropped from `index.astro` and from `navItems`.
It is a dark section sitting between Skills (light) and Contact, so with it gone
Contact had to flip cream → espresso to keep the alternation. Restoring Projects
means flipping Contact back. The comment in `index.astro` says so at the point
of use.

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
- WhatsApp `zxyden` was added above email, **deliberately unlinked**, because
  usernames had no documented link format at the time. That changed — WhatsApp
  documented `wa.me/<username>` in July 2026 — but its regional rollout was
  still completing in September 2026, so rather than ship a link that might not
  open a chat, **the entry is commented out in `site.ts`** and the contact list
  shows email, LinkedIn and GitHub only
- Contact flipped to cream when Projects landed before it
- The Involvements opener flipped espresso → cream on 2026-09-22, for a softer
  hand-off into the cream track. The opening photograph's filter inverted with
  it (washed pale rather than darkened) and took a cream scrim, so espresso type
  reads over it whatever the picture. The section itself was always light
- `README.md` rewritten for the single-page site, and `CLAUDE.md` added with a
  standing rule: this file and the README are updated after every relevant
  change. `CLAUDE.md` also records Zayden's working preferences

### Tried and reverted

- **A blue palette** read off a photo of trainers (navy / ice / slate, plus a
  blue duotone on all photos). Built fully, then reverted at the client's
  request. The site is back on espresso/cream with untreated photos
- **A photo carousel for Involvements.** Explored 2026-09-22 and **deferred** —
  the track stays as it is for now. Three readings were built as a live
  comparison: https://claude.ai/artifact/2PSeWx985nfGKUD4xZWQaz — (A) the same
  scroll-driven track with photographs instead of cards, (B) a conventional
  one-up carousel with arrows and dots, (C) a photograph beside the card's spec
  table. The finding worth keeping: **only A preserves the opening beat**,
  because B and C are not driven by scroll position, so the full-bleed photo has
  nothing to contract onto — and both would move Involvements out of GSAP into a
  third React island. A and B also dissolve the six-photos-three-events problem,
  since a repeated photo caption does not read as a duplicate the way a repeated
  card title does; C does not
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
because `onUpdate` only fires once progress moves. The class sat on `<html>`
because React rewrites the nav's own `className` on re-render.

**That mechanism was removed on 2026-09-22**, when the opener itself went cream
— the nav's own light-section colour is correct over it, so there is nothing to
counteract. The lesson stands and the code does not: **an overlay that covers
the nav has to answer for the nav's colour**, and any state the nav reads has to
live somewhere React will not overwrite. Restore both together if the opener
ever goes dark again.

**A photo that drifts inside its frame needs overscan.** Each card image is
translated `xPercent -8..8` by `motion.ts` while the track runs. At `width:100%`
there was nothing behind it, so the frame's `--field` background showed as a
strip down one edge — visible on the live site and easy to mistake for a
misaligned image. `.card-img img` is now `width: 120%; margin-left: -10%`, sized
so half the overhang exceeds the largest translation (8% of 120% is 9.6% of the
frame, against 10% of overhang). **Raising the drift means raising the
overscan.** `.track-intro-media` already did this with `inset: -10% 0`.

**Tailwind's preflight silently cancelled that fix once.** It ships
`img,video{max-width:100%;height:auto}`, so `width: 120%` on an image is clamped
straight back to 100%. Specificity never enters into it — `max-width` and
`width` are different properties, so a more specific selector does not help. The
rule sat in the built CSS looking correct and did nothing. **Any image meant to
exceed its container needs `max-width: none` alongside the width.** Check the
built CSS, not the source, when a rule appears to be ignored.

Note what was *not* wrong: the opener already lands at the card's exact width.
`landing()` in `motion.ts` measures `.card .card-img`'s live rect rather than
assuming a size, so card width and landing width cannot drift apart.

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

### 1. Deployment notes

**Settle photo consent first.** Several event photos show other students, and
pushing puts them on GitHub for good — history keeps them even after a later
deletion. Check whether `zayden995/portfolio` is public before pushing; that is
the irreversible step, not the commit.

**Vercel redeploys on push, not on commit.** A push to `main` triggers a
production build; a push to any other branch gets a preview URL instead and
leaves the live site alone.

**`npm run build` is `astro check && astro build`,** so a type error fails the
Vercel build and blocks the deploy rather than shipping broken output.

### 2. Real content

This is now the only thing standing between the site and finished.

- `src/data/involvements.ts` — six `[EVENT n]` placeholders, **live on the
  public site**. The photos are real; replace name, blurb and spec values. The
  **first** entry's photo is also the opening beat's photo
- `src/data/projects.ts` — three `[PROJECT n]` placeholders. The section is
  hidden, so this is not public, but it stays hidden until the copy exists.
  Swap in screenshots from `src/assets/photos/` and delete unused placeholders

**The six photographs cover three events**: Freshman Orientation Camp (three
frames), Industry Connect (two) and Hearts & Homies (one). Filling in the real
names as they stand would put three cards titled "Freshman Orientation Camp"
side by side in one track. Decide the structure before writing the copy.

### 3. Before deploying

- ~~**Set the real domain**~~ — done 2026-09-22. `site:` is
  `https://zaydenchua-portfolio.vercel.app`
- ~~**Connect the contact form**~~ — done 2026-09-22. `FORM_ENDPOINT` points at
  Formspree (`mvkgazqy`). The existing fetch already sent FormData with an
  `Accept: application/json` header, which is Formspree's contract, so the
  constant was the only change. **Not yet tested against a real submission**
- **Restore WhatsApp** once the username rollout reaches Singapore. Test
  `https://wa.me/zxyden` from a phone first; if it opens a chat, uncomment the
  entry in `site.ts` and nothing else needs to change. Zayden asked for it to
  stay hidden until then
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
