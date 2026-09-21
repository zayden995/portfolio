# Portfolio

Zayden Chua's personal site: a single-page, scroll-driven portfolio built with
Astro, GSAP and Lenis, with two small React islands.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # type-checks (astro check), then builds to dist/
npm run preview  # serve the production build
```

`astro dev` runs as a **background daemon** in Astro 7. If `npm run dev` exits
straight away saying a server is already running, one is — use:

```bash
npx astro dev status   # is one running, and where
npx astro dev stop     # stop it
npx astro dev logs     # read its output
```

For the history of the project, what has been tried, and known traps, see
[`HANDOFF.md`](HANDOFF.md).

---

## Making it yours

Everything you would normally edit is in `src/data/`. You should not need to
open a component to change content, add an event, or add a project.

Placeholders are in square brackets. Find every one with:

```bash
grep -rn "\[" src/data/
```

| File | What's in it |
| --- | --- |
| `src/data/site.ts` | Name, course, location, timezone, email, the hero, nav, contact links |
| `src/data/about.ts` | The statement and its four counters, bio, pillars, candidature table, skills cards |
| `src/data/involvements.ts` | The events track: heading, lede, opening line, and each event |
| `src/data/projects.ts` | The projects track: heading, lede, and each project |
| `src/data/experiences.ts` | The full list of committees, organisations and events |
| `src/data/types.ts` | The shape of a card. No content — leave it alone unless the card changes |

The site is deployed on Vercel at https://zaydenchua-portfolio.vercel.app.
`site` in `astro.config.mjs` is set to that domain — it powers canonical URLs
and `og:url`, so change it there if the domain ever changes.

**Vercel redeploys on push, not on commit.** A push to `main` builds and
replaces the live site; a push to any other branch gets its own preview URL and
leaves production alone.

### Events and projects

Both tracks use the same card, so an entry in either file looks like this:

```ts
{
  name: 'Freshman Orientation Camp',
  blurb: 'About thirty words on what it was and what you actually did.',
  image: focCommittee,            // imported at the top of the file
  imageAlt: 'The orientation organising committee',
  specs: [
    { label: 'Role', value: 'Organising committee' },
    { label: 'Organisation', value: 'School of Computing Club' },
    { label: 'Year', value: 'AY26/27' },
    { label: 'Outcome', value: 'Full cohort onboarded over three days' },
  ],
},
```

- `specs` prints as a table, in order. Events and projects can use different
  labels — `Scale` for an event, `Stack` for a project. Four rows is what the
  card is sized for
- A `Year` row is echoed in the top-right corner of the card automatically
- Put substance in the blurb. "Planned a three-day camp for 120 juniors" says
  far more than "helped with camp"

**The first event is special.** Its photo also opens the Involvements section at
full-screen size before shrinking into its own card. Whatever you put first in
`involvements.ts`, the opener follows — choose a picture that works both huge
and small.

The opener is cream, and the photo is washed pale under a cream scrim so the
heading reads over it. A very light or very busy picture can still fight the
type: the scrim is `.track-intro-media::after` in `global.css`, and raising its
alpha is the one knob to turn.

### Photos

Photos live in `src/assets/photos/` so Astro can optimise them — it serves
WebP at several sizes and lazy-loads everything except the hero portrait.

To use a new one:

1. Put the file in `src/assets/photos/`, named in lowercase with hyphens
   (no spaces or `&`)
2. Import it at the top of the data file:
   `import myEvent from '../assets/photos/my-event.jpg';`
3. Use it as `image: myEvent`, with an `imageAlt` describing what is in it

Aim for about 1600px on the long edge. Cards crop to 4:5, so keep the subject
near the middle.

Projects is currently **hidden from the page** — its three entries are still
placeholders, so the section is not rendered and not in the nav. The data and
its generated images in `src/assets/placeholders/` are untouched, waiting.
To bring it back, see the comment in `src/pages/index.astro`. Delete a
placeholder JPEG once nothing imports it.

Several photos show other people. If this repo is public, so are their faces,
and git history keeps them even after a file is deleted.

### Contact

Contact links are `socialLinks` in `site.ts`. An entry with an `href` becomes a
link; an entry without one is shown as plain text.

**WhatsApp is commented out** in `socialLinks`, waiting on WhatsApp's username
rollout. `wa.me/<username>` has been the documented format since July 2026 and
needs no phone number, but resolution landed region by region and was still
completing in September 2026, so the link could fail to open a chat for some
visitors.

To bring it back, uncomment the entry in `site.ts` once a tap on
`https://wa.me/zxyden` opens a chat from a phone:

```ts
{ label: 'WhatsApp', handle: 'zxyden', href: 'https://wa.me/zxyden' },
```

Nothing else changes — an entry with an `href` renders as a link on its own.

The contact form posts to Formspree. The endpoint is `FORM_ENDPOINT` at the top
of `src/components/ContactForm.tsx`; submissions go as FormData with an
`Accept: application/json` header. Setting it back to `null` turns the form off
again — it then validates and says plainly that nothing was sent, rather than
pretending to deliver.

The local-time clock reads `timezone` from `site.ts`, and "Based in" reads
`location`.

---

## How it's put together

### Page

One page, `src/pages/index.astro`, composing one component per section from
`src/components/sections/`:

| Section | Theme | In nav |
| --- | --- | --- |
| Hero | dark | — |
| Statement | light | — |
| About | dark | ✓ |
| Involvements | light | ✓ |
| Experiences | dark | ✓ |
| Skills | light | ✓ |
| Contact | dark | ✓ |

Projects (dark) sits between Skills and Contact when it is enabled. While it is
hidden, Contact takes the dark slot instead — otherwise Skills and Contact would
both be light and the boundary between them would disappear.

Dark and light must alternate — the switch between them is the page's only
accent. **If you reorder sections, re-check each one's theme**, set by the
`t-dark` / `t-light` class and `data-theme` on its `<section>`. The nav links
live in `navItems` in `site.ts`, and each `href` must match a section's `id`.

### Design

All tokens are at the top of `src/styles/global.css`:

- **Colour:** espresso `#312726`, cream `#fff8ed`, stone `#7a716e`. Each section's
  `.t-dark` or `.t-light` class sets `--bg`, `--fg`, `--mut`, `--rule` and
  `--field`, and everything inside reads from those
- **Type:** Archivo from Google Fonts, used across its width axis — wide and
  bold for display, slightly wide for reading, narrow and tracked for small
  labels. The type scale is `--d-xl` down to `--meta`
- **Hero portrait:** `--portrait-w` sets its size and `--portrait-inset` how far
  it sits in from the right edge

`--d-xl` is sized so the hero statement fits on one screen with the intro and
facts. Raising it pushes them below the fold.

### Motion

One rule decides which library owns an effect: **if it is tied to scroll
position, it is GSAP; otherwise it is Framer Motion.**

- **GSAP** runs from one module, `src/lib/motion.ts`, with a single entry point,
  `initMotion()`. Lenis provides the smooth scrolling and drives GSAP's
  ScrollTrigger through the GSAP ticker, so scrubbed effects stay locked to the
  smoothed position
- **Framer Motion** (the `motion` package) is used only inside the two React
  islands: the mobile nav panel in `Nav.tsx`, and the form feedback in
  `ContactForm.tsx`

What `motion.ts` drives:

| Hook | Effect |
| --- | --- |
| `#hero` | Three layers moving at three rates |
| `[data-split]` | Headings rise into view line by line |
| `[data-reveal]` | Fades up on arrival |
| `[data-count]` | Counters run up to their value |
| `.blueprint` | The candidature drawing assembles itself |
| `[data-track]` | Pins a track and moves it sideways |
| `[data-track-intro]` | The Involvements opener: photo shrinks into the first card |
| `[data-index-list]` | Experiences rows light up as you scroll |
| `[data-clock]` | Live clock — runs even with reduced motion |

**Nothing is hidden in CSS.** Every animated starting state is applied by GSAP,
and only when motion is allowed. With `prefers-reduced-motion`, nothing pins and
the tracks become vertical stacks — the page at rest is the whole page.

### Tracks

`src/components/TrackSection.astro` renders a pinned horizontal track;
`TrackCard.astro` renders each card. Involvements and Projects are thin
wrappers around it.

- A track pins and scrolls sideways only on screens wider than 860px. Below
  that, the cards stack vertically
- A track whose cards already fit the screen does not pin — there would be
  nothing to scroll
- Passing `intro` gives a track the opening beat Involvements uses. The photo is
  measured against the first card at runtime, so changing card sizes moves the
  landing with it

### Experiences

The index pins only on screens wider than 860px **and** at least 860px tall.
Fourteen rows will not fit a shorter screen at a readable size, so those get the
phone behaviour instead: each row lights up as it arrives.

### React islands

Only two, both for state rather than decoration:

- `Nav.tsx` — mobile menu, and switching colour depending on the section beneath it
- `ContactForm.tsx` — validation and send state; hydrates only when scrolled to

---

## Keeping docs current

After any relevant change, update **both** this README and
[`HANDOFF.md`](HANDOFF.md) in the same piece of work:

- **README** is the manual: how to run it, where content lives, how it works.
  Change it whenever those answers change
- **HANDOFF** is the record: current state, what changed, what failed, what is
  next. Change it whenever the project's state or history moves

See `CLAUDE.md` for what counts as a relevant change.
