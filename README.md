# Portfolio

A personal site built with Astro, React islands, Tailwind CSS, GSAP, anime.js,
and React Spring.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # type-checks, then builds to dist/
npm run preview  # serve the production build
```

## Making it yours

Anything still wrapped in square brackets is a placeholder — search the project
for `[` to find them all. Almost everything lives in four files:

| File | What's in it |
| --- | --- |
| `src/data/site.ts` | Name, school, course, location, email, the home headline, nav, social links |
| `src/data/involvements.ts` | CCAs, community work, and the events shown in the tracks |
| `src/data/about.ts` | Skill groups, and education with the roles held at each school |
| `src/styles/global.css` | Colours, fonts, and the type scale |

Then update the page copy in `src/pages/*.astro`, and set your real domain as
`site` in `astro.config.mjs` so canonical URLs are correct.

### Involvements

`src/data/involvements.ts` holds a list of groups. Each group has:

- `tint` — which colour world the chapter sits in (`school` or `community`)
- `pullQuote` — one line that sits inside the photo wall
- `organisations` — one or more, each with its `roles` listed newest first
- `events` — the photographs you scroll sideways through, each with an image and
  a short description

The page renders one block per group: a vertical intro with the roles, then the
sideways photo wall. Add a group and a new track appears. `currentRoles` at the bottom
of the file is derived from the same data and feeds the home page summary, so
the two never drift apart.

Put the substance in `highlights` and event descriptions. "Planned a 3-day camp
for 120 juniors" tells a reader far more than "helped with camp".

### Photos

Every event image is currently an Unsplash placeholder. Drop your own files into
`public/photos/`, then swap the URL:

```ts
image: '/photos/orientation-camp.jpg',
imageAlt: 'Briefing the orientation groups in the atrium',
```

Plate shapes cycle through a table in `InvolvementGroup.astro` — tall, square,
landscape and panoramic — so a mix of crops looks intentional. Aim for ~1600px wide and keep
each file under about 500KB. The About portrait wants something closer to 4:5.

### Contact form

The form does not send anywhere yet, and says so rather than pretending to. Open
`src/components/ContactForm.tsx` and set `FORM_ENDPOINT` to a form endpoint
(Formspree, Basin, Netlify Forms, or your own handler) to switch it on. The
direct email and social links on the Contact page work already.

### Projects — hidden, not deleted

There is no Projects page right now. The pieces are still here for when you have
work to show: `src/components/ProjectCarousel.tsx` (a 3D drag-and-spring
carousel) and `src/data/projects.ts`.

To bring it back, add `{ label: 'Projects', href: '/projects' }` to `navItems`
in `src/data/site.ts` and create `src/pages/projects.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PageHeader from '../components/PageHeader.astro';
import Section from '../components/Section.astro';
import ProjectCarousel from '../components/ProjectCarousel.tsx';
import { projects } from '../data/projects';
---

<BaseLayout title="Projects" description="[Description]">
  <PageHeader eyebrow="Projects" title="[Selected work]" lead="[A line about the work.]" />
  <Section eyebrow={`${projects.length} projects`} wide>
    <div data-reveal>
      <ProjectCarousel client:visible projects={projects} />
    </div>
  </Section>
</BaseLayout>
```

## How it's put together

**Design tokens** are defined once in `src/styles/global.css` under `@theme` —
a deep blue ground (`--color-ground`), a raised panel tone, cool off-white type,
a cyan accent, and one tint per involvement chapter. Changing a value there
updates the whole site.

The blue wash itself is a fixed radial gradient painted on `body::before` rather
than the body background — `background-attachment: fixed` is unreliable on iOS,
and a fixed layer keeps the gradient steady while the page scrolls over it.

One naming trap: the ground token is `--color-ground`, not `--color-base`.
Tailwind already owns `text-base` as a font size, so a colour called `base`
would lose that collision silently.

**Motion** is in `src/lib/animations.ts`, and there is only one entry point:

- `[data-hero-root]` — the page-load sequence
- `[data-reveal]` — fades up as it scrolls into view
- `[data-rule]` — hairline dividers that draw in
- `[data-track]` — the photo wall, pinned and moved sideways on scroll
- `[data-split-lines]` — text split into lines and raised into view

All of it is skipped when the visitor prefers reduced motion, and the CSS makes
those elements visible in that case so nothing is ever trapped invisible.

### The photo walls

Each wall pins its section and travels the photographs sideways as you scroll
down. Plates sit at varied heights and float vertically as the wall moves, which
is what gives the wall depth instead of sliding as one flat sheet. That drift is
deliberately vertical: drifting plates sideways lets neighbours cross over each
other as soon as the drift exceeds the gap between them.

Two things keep it safe:

- Scroll distance is read through a function paired with `invalidateOnRefresh`,
  so a resize or a late-loading font recalculates it instead of leaving the last
  photo unreachable. A wall whose photos already fit gets no pin at all.
- The horizontal layout is opt-in CSS, gated behind `html.js`, a
  `min-width: 768px` query, and `prefers-reduced-motion: no-preference`. Narrow
  screens, reduced motion, and no-JS all fall back to a plain vertical column, so
  the photos are never trapped inside an overflow they cannot scroll.

### Line reveals

`[data-split-lines]` text is split with anime.js's `splitText()`, each line
wrapped in a clipping element so it can be raised into view from behind its own
edge, then animated with anime.js.

Two details matter:

- Splitting waits for `document.fonts.ready`. Line breaks depend on the final
  metrics, and splitting changes element heights — so ScrollTrigger is refreshed
  afterwards.
- Cards inside a pinned track are handed that track's tween as
  `containerAnimation`. Without it ScrollTrigger measures their vertical
  position and fires every card at once, because horizontally they never move
  down the page.

**React islands** are used only where interaction needs state or physics:

- `Nav.tsx` — the underline springs between links and settles on the current page
- `ContactForm.tsx` — form state
- `ProjectCarousel.tsx` — dormant, see above

Scroll reveals are deliberately applied on the Astro side of an island boundary,
never inside one: GSAP animates via inline styles, and React is free to clobber
those during hydration.

**Fonts** load from Fontshare via `src/layouts/BaseLayout.astro`. Two families:
Erode, an old-style serif in the Times New Roman mould, for anything you read;
and Switzer for captions, counters and labels. That serif/grotesque split is
what gives the page its technical edge.

One gotcha if you add another face: Fontshare silently drops families from
multi-family URLs (`?f[]=a&f[]=b&f[]=c`) — it returns CSS for some and omits the
rest, with no error. Use a separate `<link>` per family.

To self-host instead, download the family and swap the `<link>` for local
`@font-face` rules.
