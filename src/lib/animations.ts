import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate, splitText, stagger, utils } from 'animejs';

gsap.registerPlugin(ScrollTrigger);

/**
 * Page motion, in five parts:
 *
 *   1. `[data-hero-root]`    — one orchestrated intro that runs on page load.
 *   2. `[data-reveal]`       — everything below the fold, revealed on scroll.
 *   3. `[data-rule]`         — hairline dividers that draw in from the left.
 *   4. `[data-track]`        — event cards, pinned and moved sideways.
 *   5. `[data-split-lines]`  — text split into lines and raised into view.
 *
 * All of it is skipped when the visitor prefers reduced motion. The CSS in
 * `global.css` makes those elements visible in that case, so nothing is lost.
 */

/** Horizontal tweens, keyed by their section, so line reveals inside a track
 *  can hand ScrollTrigger the `containerAnimation` it needs. */
const trackTweens = new Map<Element, gsap.core.Tween>();

export function initAnimations(): void {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  playHeroIntro();
  revealOnScroll();
  drawRules();
  slideTracks();

  // Splitting text into lines depends on final text metrics, and it changes
  // element heights — so it waits for the fonts, then re-measures everything.
  void Promise.resolve(document.fonts?.ready).then(() => {
    revealLines();
    ScrollTrigger.refresh();
  });
}

/** The page-load sequence: masked lines rise, supporting detail fades up under them. */
function playHeroIntro(): void {
  const hero = document.querySelector('[data-hero-root]');
  if (!hero) return;

  const lines = hero.querySelectorAll('[data-reveal-mask] > *');
  const items = hero.querySelectorAll('[data-hero-item]');
  const timeline = gsap.timeline({ delay: 0.15 });

  if (lines.length) {
    // `y: 0` is load-bearing. The pre-JS CSS state is `translateY(110%)`, which
    // GSAP resolves into a pixel `y` offset; animating `yPercent` alone would
    // leave that offset behind and the line would never clear its mask.
    timeline.fromTo(
      lines,
      { yPercent: 110, y: 0 },
      { yPercent: 0, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.09 },
      0,
    );
  }

  if (items.length) {
    timeline.fromTo(
      items,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 },
      0.4,
    );
  }
}

/** Everything else: a short fade and lift as it enters the viewport, once. */
function revealOnScroll(): void {
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.fromTo(
        batch,
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07, overwrite: true },
      ),
  });
}

/** Hairline rules draw in — the structural device, so it gets the structural motion. */
function drawRules(): void {
  gsap.utils.toArray<HTMLElement>('[data-rule]').forEach((rule) => {
    gsap.fromTo(
      rule,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.1,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: rule, start: 'top 92%', once: true },
      },
    );
  });
}

/**
 * The event tracks.
 *
 * Wide screens only: each section pins to the viewport and its cards travel
 * sideways as you scroll down. Scroll distance is read through a function
 * paired with `invalidateOnRefresh`, so a resize or a late-loading font
 * recalculates it rather than leaving the last card unreachable.
 *
 * `matchMedia` reverts everything below the breakpoint, which drops the pin and
 * hands the cards back to ordinary vertical scrolling.
 */
function slideTracks(): void {
  const sections = gsap.utils.toArray<HTMLElement>('[data-track]');
  if (!sections.length) return;

  gsap.matchMedia().add('(min-width: 768px)', () => {
    sections.forEach((section) => {
      const inner = section.querySelector<HTMLElement>('[data-track-inner]');
      const fill = section.querySelector<HTMLElement>('[data-track-progress-fill]');
      if (!inner) return;

      const movers = Array.from(inner.querySelectorAll<HTMLElement>('[data-depth]'));

      const travel = () => Math.max(0, inner.scrollWidth - window.innerWidth);

      // A track that already fits needs no pin — pinning it would trap the
      // page for a scroll distance of zero.
      if (travel() <= 0) return;

      const tween = gsap.to(inner, {
        x: () => -travel(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + travel(),
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (fill) gsap.set(fill, { scaleX: self.progress });

            // Plates float vertically as the wall travels. Drifting them
            // sideways instead would let neighbours cross over each other,
            // because the drift quickly exceeds the gap between them.
            for (const mover of movers) {
              const depth = Number(mover.dataset.depth) || 0;
              mover.style.setProperty(
                '--py',
                ((self.progress - 0.5) * depth * window.innerHeight).toFixed(1) + 'px',
              );
            }
          },
        },
      });

      trackTweens.set(section, tween);
    });

    return () => {
      trackTweens.clear();
    };
  });
}

/**
 * Line reveals, using anime.js's text splitter.
 *
 * Each target is split into lines wrapped in a clipping element, so a line can
 * be raised into view from behind its own edge. Cards sitting inside a pinned
 * track are handed that track's tween as `containerAnimation` — without it,
 * ScrollTrigger would measure their vertical position and fire everything at
 * once, because horizontally they never move down the page.
 */
function revealLines(): void {
  gsap.utils.toArray<HTMLElement>('[data-split-lines]').forEach((element) => {
    const splitter = splitText(element, { lines: { wrap: 'clip', class: 'split-line' } });
    const lines = splitter.lines;

    element.style.visibility = 'visible';
    if (!lines.length) return;

    utils.set(lines, { y: '110%' });

    const section = element.closest('[data-track]');
    const containerAnimation = section ? trackTweens.get(section) : undefined;

    ScrollTrigger.create({
      trigger: element,
      containerAnimation,
      start: containerAnimation ? 'left 95%' : 'top 90%',
      once: true,
      onEnter: () => {
        animate(lines, {
          y: ['110%', '0%'],
          duration: 900,
          delay: stagger(70),
          ease: 'outExpo',
        });
      },
    });
  });
}
