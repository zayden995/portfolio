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
- **No `Co-Authored-By: Claude` trailer in commit messages.** Write the message
  as his own. This overrides any default attribution the harness suggests
- **Show the full commit message before asking to commit or push.** Every
  time, follow-up commits included, so he approves the exact text rather than
  a description of it
- **Build from an approved design; skip separate plan documents.** Once he has
  approved a design (usually from a live preview), build it — keep any
  step-by-step checklist internal rather than writing a plan file for him to
  review. If you do stop at a gate, say plainly whether the site has changed
  yet and what the next step produces; process paperwork has confused him
  before
- **When he reports something that looks wrong, explain the cause plainly
  first**, then offer the fix — with the options if the fix is a visual choice
- **He works in the Claude Code extension for VS Code.** Give instructions in
  VS Code terms (menus, the Claude Code panel) rather than terminal commands,
  unless a terminal step is unavoidable
- **End every session by telling him how to start the next one.** When a
  session's work is wrapping up — he says he is done, or the planned work is
  finished:
  1. **Ask what is on the agenda for next session**, and suggest unfinished
     work he could pick from — placeholders still open, checks never run,
     items in `HANDOFF.md`'s *What should be done next*. If he already gave
     the agenda this session, use it and just offer the suggestions
  2. Update the next-session list in `HANDOFF.md` to match
  3. Close with a short "Starting next session" message covering:
     - Open the `portfolio` folder itself in VS Code (**File → Open
       Folder…**), not the `Personal` folder above it — only then does this
       file load on its own
     - Open the Claude Code panel in that window
     - **The first message to paste**, in a code block so it copies cleanly,
       written from the agenda
     - Anything to prepare beforehand — photos dropped into
       `src/assets/photos/`, copy written out, decisions to make

  Keep it to a few lines, and make it match `HANDOFF.md`
