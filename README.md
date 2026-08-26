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

### Projects — live, but still placeholder

`/projects` is back in the nav and rendering. What it is **not** yet is true:
every entry in `src/data/projects.ts` is an invented placeholder, down to the
stock photography. Replace them before this goes anywhere public — a portfolio
that lists work you did not do is worse than a portfolio with no work on it.

Each entry wants a title, a one-line summary, the year, a link if there is one,
and an image. Drop screenshots in `public/work/` and point `image` at
`/work/whatever.jpg`. Delete `comingSoon` once the entry is real.

The carousel shows images and nothing else — no titles, no captions — so the
"Coming soon" wording is drawn into the placeholder plates themselves by
`comingSoonPlate()` in `src/data/projects.ts`. It returns an inline SVG data
URI, which is why those plates cost no request and stay sharp at any size.

The page picks its layout from the entry count: three or more get
`RoundCarousel.tsx`, fewer get a plain grid. That is a correctness rule, not a
taste one. The ring's radius divides by `tan(PI / count)`, which is infinite at
two plates and zero at one, so below three the geometry is undefined. The
threshold is `useCarousel` at the top of `src/pages/projects.astro`.

For the same reason the page passes `spacing={8}` rather than the component's
default of `3`: at exactly three plates the default radius works out near 126px
while the plates are 300px wide, and they intersect.

## How it's put together

**Design tokens** are defined once in `src/styles/global.css` under `@theme` —
a black ground (`--color-ground`), a raised panel tone, off-white type, a pure
white accent, and one tint per involvement chapter. The palette is monochrome
throughout: there is no hue anywhere in the system, and hierarchy is carried by
value and weight instead of colour. Changing a value there updates the whole
site.

Because accent is white and type is nearly white, anything sitting *on* a light
surface has to hover darker rather than toward the accent — see the `solid`
variant in `ActionLink.astro` and the submit button in `ContactForm.tsx`.

The wash behind everything is a fixed radial gradient painted on `body::before`
rather than the body background — `background-attachment: fixed` is unreliable
on iOS, and a fixed layer keeps it steady while the page scrolls over it.

**The live background** is `src/lib/reflect.ts`: a single-pass WebGL caustic
field (component by Originkit, shaders unmodified) on one fixed canvas. It
builds its own element rather than sitting in the markup, so no JavaScript, no
WebGL, or `prefers-reduced-motion` all mean no canvas at all — those visitors
get the gradient above, which is why it has to hold the page on its own. Every
tunable is in the `CONFIG` object at the top of that file.

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
- `RoundCarousel.tsx` — the projects ring: 3D transforms driven per frame

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
