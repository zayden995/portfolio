# Handoff — Zayden Chua portfolio

Last updated: 2026-09-25

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
temple community he has belonged to since 2012. Those three are the site's
spine: the **Involvements** section tells them one by one. It is not a
freelancer portfolio and does not advertise availability for work.

The current direction is a **single-page, cinematic scroll site modelled on
jeskojets.com**: dark and light sections inverting, large extended display type,
photography carrying the page, and slow, settled scroll-driven motion.

---

## Current state

**Committed and pushed on 2026-09-25** as *Rebuild Involvements around three
commitments* — the new Involvements section replacing the old track and
Experiences, the About rename, the reorder and re-theme, and the new contact
email. A push to `main` triggers Vercel's production deploy at
https://zaydenchua-portfolio.vercel.app.

Build is clean (`astro check`: 0 errors, 0 warnings, 0 hints).

The change was verified in an isolated headless Chrome against the production
build, at 1440×900, 1280×720 and 390×844 and with `prefers-reduced-motion`:

- No console errors, no horizontal overflow, all four nav anchors land at 0px
- Held layout at both desktop sizes: wheeling through the section produced all
  15 photo beats in the data's order, with the right photo, caption and count
  each time, and a transition into every one of them; the list fitted the view
  at every sample; photos sat exactly on the frame (0px offset); every opener
  opened fully and sat below the nav
- Stacked layout (phone, reduced motion): all 12 events' details open, all 6
  event photos visible, all 3 opener titles visible, no held frame
- About, Skills and Contact read correctly in their new themes, including the
  candidature drawing and the contact form

Still never checked: the contact form actually submitting to Formspree.

```
main  [pushed to origin/main on 2026-09-25]
  (latest) Rebuild Involvements around three commitments
  a7e0958  Point the site at its real domain, wire the form, hide Projects
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
| About | `about` | cream | About | “About me.” — bio, four pillars, candidature table + blueprint drawing |
| Involvements | `involvements` | espresso | Involvements | SOCC, SOCA, the temple: group-photo opener, then a held photo frame beside the event list |
| Statement | `statement` | cream | — | “It is never really about the event.”, four animated counters |
| Skills | `skills` | espresso | Skills | Four image-and-text cards |
| Contact | `contact` | cream | Contact | Form, email/socials, local time, based in |

**Projects is hidden.** Its three entries are still `[PROJECT n]` placeholders,
so on 2026-09-22 the section was dropped from `index.astro` and from `navItems`.
It is a dark section, and it would sit between Skills (now dark) and Contact
(now light), so restoring it means making Projects light and flipping Contact
back to dark. The comment in `index.astro` says so at the point of use.

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
| `src/data/involvements.ts` | Three commitments: name, short label, since, roles, group photo, events (name, year, blurb, specs, photos). Its types live in the same file |
| `src/data/projects.ts` | Projects track (hidden): heading, lede, three projects |
| `src/data/types.ts` | `TrackItem` — the project card shape. No content |

Adding an event, a photo or a project is one array entry. Placeholders are in
square brackets: `grep -rn "\[" src/data/`

### Components

| File | Purpose |
| --- | --- |
| `src/components/sections/Involvements.astro` | Involvements: openers, event rows (details, photos, or a desktop-only `[PHOTO]` placeholder), and the desktop-only stage (frame ground, progress line, caption) |
| `src/components/TrackSection.astro` | One pinned horizontal track. Its `intro` prop was removed with Involvements |
| `src/components/TrackCard.astro` | One card: image, eyebrow, name, blurb, spec table |
| `src/components/sections/*.astro` | One file per section. `Projects` is a thin wrapper around `TrackSection` |
| `src/components/Nav.tsx` | React island. Four anchors, mobile panel, theme inversion |
| `src/components/ContactForm.tsx` | React island. Validates and posts to Formspree |

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
| `docs/superpowers/specs/2026-09-25-my-commitments-design.md` | Design spec for the section, as approved while it was called My commitments. A snapshot of the decision; Zayden chose to keep both specs |

---

## What changed

### My commitments replaces Involvements and Experiences (2026-09-25)

Zayden asked for the site to be told by organisation: SOCC, SOCA and the
temple, each with its events, with photos arriving as you scroll. The design
was settled on live previews before any code changed — all three rounds are
versions of https://claude.ai/artifact/PDztunwcSdAXSFjXv3wUAv:

1. Three readings of "pictures appear as you scroll": (A) a sticky photo frame
   beside the list, (B) full-screen group-photo chapter openers with staggered
   prints, (C) the Experiences index with small pop-in photos. Zayden chose A
   with B's openers
2. The same, with a control for scroll per photo. He chose **⅔ of a screen**
3. Used in place of Involvements, with each event's details dropping open as it
   is shown. Approved, including the deletions below

What that did to the page:

- **Involvements and Experiences are gone.** Deleted: `Involvements.astro`,
  `involvements.ts`, `Experiences.astro`, `experiences.ts`; `TrackSection`'s
  `intro` prop; the opener branch and both Experiences blocks in `motion.ts`;
  `.track-intro*` and the Reach `.index-*` CSS. All recoverable from `a7e0958`
- **The Experiences list seeded the new data.** Its 14 entries became roles and
  events under the three commitments; its photos moved onto the events they
  show. The *six-photos-three-events* problem is gone with it — a photo now
  belongs to an event, and an event can have several
- **"The short version." → "About me."**
- **Reordered and re-themed:** Hero → About (now cream) → My commitments
  (espresso) → Statement (moved from 2nd to 4th, stays cream) → Skills (now
  espresso) → Contact (now cream). Nav: About · Commitments · Skills · Contact
- **Renamed back to Involvements** the same day, at Zayden's request: heading
  "Involvements.", nav label Involvements, anchor `#involvements`. The files
  followed: `commitments.ts` → `involvements.ts`, `Commitments.astro` →
  `Involvements.astro`, and the heading export is `involvementsSection`. They
  reuse the deleted files' names, so git shows them as **modified**, not new.
  The list and its type (`commitments`, `Commitment`), the CSS classes
  (`.commit-sec`, `.cm-*`), `--commit-hold`, `data-commitments` and the
  `motion.ts` names keep the commitment naming — each entry still is one

How it is built, and why:

- **The markup is the stacked layout** — details open, photos under each row —
  and `.is-staged` switches CSS to the held one. That keeps the site's rule that
  nothing is hidden in CSS: no-JS and reduced motion get the whole section
- **Held with `position: sticky`, not a GSAP pin.** Progress through each run's
  height picks the beat; one `ScrollTrigger` per run with `onUpdate`, no pin
- **Gate: wider than 860px and at least 720px tall**, the height the list needs
  with one event's details open
- **Photos are rendered once** and laid onto the frame by CSS variables shared
  with the frame, caption and progress line
- **An event with no photo gets its own `[PHOTO]` placeholder frame** in its
  row, desktop only. It first shared the chapter's group photo instead, which
  lost the transition between those events — see *What failed*. Zayden chose
  the placeholder over a repeated group photo
- **`--commit-hold`** in `global.css` is the one knob; `motion.ts` reads it
- **Openers start below the nav bar**, so the cream nav never sits on a bright
  photograph — the lesson from the old opener's nav problem, applied up front

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
reveals, `data-reveal` entrances, counters, the blueprint draw-on, the Projects
track (hidden), and Involvements — the openers and the held frame. Until
2026-09-25 it also drove the Involvements opening beat and the Experiences
index scrub.

### The Involvements opening beat — removed 2026-09-25

**Deleted with Involvements; the last working version is `a7e0958`.** Kept here
because the lessons below still apply to any "this becomes that" effect.

The section opened on **the first event card's own photograph at full viewport
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

Several traps below come from the Involvements opener and the Experiences pin,
both removed on 2026-09-25. The code is gone; the lessons are kept because they
apply to anything similar.

**Two events sharing one frame element lose the transition between them.**
The held frame only wipes when the element on top changes. At first every
photo-less event in a chapter pointed at one shared group-photo element, so
Movie Night → Shirt Sales → Sustainability Hackathon (and SOCA's first three,
and all three temple events) changed caption and details but not the picture.
Zayden spotted it. Fixed by giving each such event its own placeholder frame.
A browser check now fails if two consecutive beats share an element — it
reported 6 missing transitions before the fix and 0 after.

**A photo inside a dimmed row dims with it.** In Involvements the event
photos live inside their rows but are laid onto the frame. Putting the
inactive-row opacity on the row itself would have dimmed the outgoing photo
while the next one wiped over it. The dimming targets the row's text children
instead (`.cm-row > :not(.cm-photos)`).

**Sets made on scroll escape `gsap.matchMedia` cleanup.** A context only records
what runs while its function executes. The frame's per-beat `gsap.set` calls
run later, from `onUpdate`, so crossing the breakpoint would leave their
transforms behind. The cleanup clears them by hand.

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

**`npm i` in a folder with no `package.json` installs into the nearest parent
that has one** — and `C:\Users\zayde` has one. On 2026-09-25 a scratch install
of `playwright-core` landed in `C:\Users\zayde\node_modules` that way; it was
removed by hand (package folder, three `.bin` shims, one entry in
`node_modules/.package-lock.json`), leaving that folder as it was. Run
`npm init -y` in a scratch folder before installing anything there.

**Every file here is CRLF** (`core.autocrlf` is true; git stores LF). Scripted
edits that match multi-line text must normalise to LF first and write CRLF
back.

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

### Next session — planned by Zayden on 2026-09-25

1. **Tweak the content** in `src/data/` — the Involvements placeholders listed
   under *Real content* below, and anything else he wants reworded
2. **Add photos** — group photos for SOCA and the temple, and photos for the
   events that have none. See *Photos* in `README.md` for where they go
3. **Sum up the project** — he intends to wrap the site up soon after. Ask what
   "sum up" should cover (a final deploy, a final handoff, a write-up) rather
   than assuming

Also open, suggested to him for when there is time:

- **Send one real message through the contact form** — it has never been
  tested end to end — and check that Formspree (`mvkgazqy`) delivers to his
  new address, `zaydencbx21@gmail.com`. That destination is set on
  formspree.io, not in the code
- **Projects** — still hidden with `[PROJECT n]` placeholders. Decide whether
  it comes back before the wrap-up or is dropped for good
- **WhatsApp** — test `https://wa.me/zxyden` from a phone; if it opens a chat,
  uncomment the entry in `site.ts`
- **Photo consent** from the people in the event photos, since the repo is
  public

`src/data/` is the only place content changes should need. Real photos added
next session go public on push — the repo is **public**.

### 1. Deployment notes

**Settle photo consent first.** Several event photos show other students, and
pushing puts them on GitHub for good — history keeps them even after a later
deletion. `zayden995/portfolio` **is public** (checked 2026-09-25 through the
GitHub API; `gh` is not installed), so pushing is the irreversible step, not
the commit.

**Vercel redeploys on push, not on commit.** A push to `main` triggers a
production build; a push to any other branch gets a preview URL instead and
leaves the live site alone.

**`npm run build` is `astro check && astro build`,** so a type error fails the
Vercel build and blocks the deploy rather than shipping broken output.

### 2. Real content

This is now the only thing standing between the site and finished.

- `src/data/involvements.ts` — Zayden will supply these once the site's layout
  is settled:
  - every event's `blurb` and its `Role / Scale / Outcome` values
  - the temple's events: three `[EVENT n]` / `[YEAR]` placeholders
  - group photos for **SOCA** and **the temple** (currently a marked field)
  - photos for the nine events without any: Movie Night, Shirt Sales,
    Sustainability Hackathon, SP Open House, DSTA BrainHack, SPxHP Workshop,
    and the three temple events
  - whether `foc-committee` stays as SOCC's group photo — it is the orientation
    committee, used as the nearest thing to a club group shot
- `src/data/projects.ts` — three `[PROJECT n]` placeholders. The section is
  hidden, so this is not public, but it stays hidden until the copy exists.
  Swap in screenshots from `src/assets/photos/` and delete unused placeholders

The placeholders go public the moment this change is pushed, as the old
`[EVENT n]` cards were.

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

- **Involvements is long, and grows with every photo.** At `--commit-hold:
  0.67` it is about 18 screens of scrolling on desktop: three openers at 1⅔
  screens each, and each run one screen plus ⅔ per photo (15 beats today).
  Zayden chose ⅔ from a live preview that showed the total. Lowering the knob
  shortens everything at once
- **The held list has to fit.** Sized for five events with three spec rows at
  1280×720. A commitment with many more events, or longer blurbs, needs the
  height in `CAN_STAGE_COMMITMENTS` raised
- **Bundle.** ~463 KB JS uncompressed (~150 KB gzipped). React plus Motion is
  roughly two-thirds of that, for two small islands. Replacing both in vanilla
  would cut it sharply, at the cost of dropping Framer Motion from the stack
- **No-JS on desktop** now shows Involvements stacked, which is complete. The
  one remaining gap is the Projects track rendering as a clipped row, which
  only matters once Projects is restored

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
