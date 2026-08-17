import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Page motion, in three parts:
 *
 *   1. `[data-hero-root]`  — one orchestrated intro that runs on page load.
 *   2. `[data-reveal]`     — everything below the fold, revealed on scroll.
 *   3. `[data-rule]`       — hairline dividers that draw in from the left.
 *
 * All of it is skipped when the visitor prefers reduced motion. The CSS in
 * `global.css` makes those elements visible in that case, so nothing is lost.
 */
export function initAnimations(): void {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  playHeroIntro();
  revealOnScroll();
  drawRules();

  // Web fonts change element heights. Re-measure once they land so scroll
  // triggers fire at the right place.
  void document.fonts?.ready.then(() => ScrollTrigger.refresh());
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
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.07,
          overwrite: true,
        },
      ),
  });
}

/** Hairline rules draw in — the structural device, so it gets the structural motion. */
function drawRules(): void {
  const rules = gsap.utils.toArray<HTMLElement>('[data-rule]');

  rules.forEach((rule) => {
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
