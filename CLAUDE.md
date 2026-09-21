# CLAUDE.md

Zayden Chua's single-page portfolio: Astro 7, GSAP + ScrollTrigger + Lenis, two
React islands. Read `HANDOFF.md` before starting work — it holds the current
state, known traps, and what is next.

## Keep the docs current — every time

After **every relevant change**, update both `HANDOFF.md` and `README.md` as
part of the same task, before reporting the work as done. Not in a later pass,
and not only when asked.

A change is relevant if it alters any of:

- Sections: added, removed, renamed, reordered, or re-themed
- Files: added, deleted, renamed, or moved
- Data shapes in `src/data/` — fields, exports, or what a file holds
- Dependencies, scripts, or config
- Motion behaviour: what pins, animates, or degrades, and when
- Design tokens: colours, type, scale, spacing knobs
- How to run, edit, or deploy the site
- A bug found or fixed, a trap discovered, or a direction tried and abandoned
- Anything listed under "What should be done next" in `HANDOFF.md`

Editing copy inside an existing data entry is not a relevant change, unless it
clears a placeholder that `HANDOFF.md` lists as outstanding.

What goes where:

- **`README.md`** — the manual. How to run it, where content lives, how the
  pieces work. Present tense, no history
- **`HANDOFF.md`** — the record. Current state, what changed, what failed and
  why, what is next. Bump its "Last updated" date

If a change makes something in either file wrong, fix it — do not leave stale
sections for later. When finishing, say which of the two files were updated.

## Working with Zayden (Preferences)

How Zayden likes to work, learned from earlier sessions. Follow these unless he
says otherwise in the moment.

- **Show visual options before building them.** When a choice is visual — a
  transition, a layout, a motion effect — he prefers to compare live options
  in an artifact first, rather than pick from written descriptions
- **Flag trade-offs before building, not after.** If a design has a catch (it
  holds the scroll, it's a match cut rather than a true handoff, it drops a
  feature), say so up front so he can decide before the work is done
- **Build what he describes, literally.** When he describes an effect, the
  result should actually do that. If it can only approximate it, say so rather
  than shipping the approximation as if it matched
- **Use placeholders, never invented content.** Anything real he hasn't
  supplied — events, projects, blurbs, outcomes — goes in as a clearly marked
  `[PLACEHOLDER]`. Keep his real photos where they exist
- **Free the dev server when you finish.** He runs `npm run dev` himself. Stop
  any server you started (`npx astro dev stop`, and kill anything still holding
  port 4321) so his command works
- **Undo means undo fully.** When he asks to revert a change, revert everything
  that change introduced, including side changes made alongside it
- **Ask before destructive or hard-to-reverse steps.** Deleting files or
  folders, restructuring sections, or removing work. Don't commit or push
  unless he asks
- **Verify in a real browser before calling it done** — desktop and mobile
  widths, with no console errors. A clean build is not enough
