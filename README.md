# Portfolio

A personal portfolio built with Astro, React islands, Tailwind CSS, GSAP, and React Spring.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # type-checks, then builds to dist/
npm run preview  # serve the production build
```

## Making it yours

Every placeholder is wrapped in square brackets — search the project for `[` to
find them all. Almost everything lives in four files:

| File | What's in it |
| --- | --- |
| `src/data/site.ts` | Your name, role, location, email, availability, social links |
| `src/data/projects.ts` | The projects shown on Home and Projects |
| `src/data/about.ts` | Skill groups and the experience timeline |
| `src/styles/global.css` | Colors, fonts, and the type scale |

Then update the page copy and metadata in `src/pages/*.astro`, and set your real
domain as `site` in `astro.config.mjs` so canonical URLs are correct.

### Projects

Add or remove entries in `src/data/projects.ts`. Anything with `featured: true`
also appears on the home page. Replace `image` with your own screenshot — either
a URL or a file in `public/` (e.g. `/work/my-app.jpg`). The placeholders point at
Unsplash.

### Contact form

The form does not send anywhere yet, and says so rather than pretending to. Open
`src/components/ContactForm.tsx` and set `FORM_ENDPOINT` to a form endpoint
(Formspree, Basin, Netlify Forms, or your own handler) to switch it on. The
direct email and social links on the Contact page work already.

## How it's put together

**Design tokens** are defined once in `src/styles/global.css` under `@theme` —
the chalk/ink/accent palette, the Erode type scale, and the fluid sizes.
Changing a value there updates the whole site.

**Motion** is in `src/lib/animations.ts`, and there is only one entry point:

- `[data-hero-root]` — the page-load sequence
- `[data-reveal]` — fades up as it scrolls into view
- `[data-rule]` — hairline dividers that draw in

All of it is skipped when the visitor prefers reduced motion, and the CSS makes
those elements visible in that case so nothing is ever trapped invisible.

**React islands** are used only where interaction needs state or physics:

- `Nav.tsx` — the underline springs between links and settles on the current page
- `ProjectCarousel.tsx` — the 3D project carousel
- `ContactForm.tsx` — form state

The carousel arranges cards on a ring: the active one faces you, its neighbours
are turned on the Y axis and pushed back in Z. Drag it, use the arrows, or press
the left/right arrow keys. Every position is a spring, so a flick settles rather
than snapping, and the ring wraps so the stage is never lopsided. Tune the feel
with `ROTATION`, `DEPTH`, and `VISIBLE` at the top of the file.

Scroll reveals are deliberately applied on the Astro side of an island boundary,
never inside one: GSAP animates via inline styles, and React is free to clobber
those during hydration.

**Fonts** load from Fontshare via `src/layouts/BaseLayout.astro`. The site uses
one family, Erode, an old-style serif in the Times New Roman mould.

One gotcha if you add another face: Fontshare silently drops families from
multi-family URLs (`?f[]=a&f[]=b&f[]=c`) — it returns CSS for some and omits the
rest, with no error. Use a separate `<link>` per family.

To self-host instead, download the family and swap the `<link>` for local
`@font-face` rules.
