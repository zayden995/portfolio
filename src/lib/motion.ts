/**
 * All scroll-driven motion on the page.
 *
 * The rule that decides what lives here: **if it is scrubbed to scroll
 * position, it is GSAP.** Everything else — hover states, the mobile nav
 * panel, form feedback — is Framer Motion inside a React island.
 *
 * Nothing in global.css hides anything. Every from-state below is set by GSAP
 * and only when motion is allowed, so the page at rest (no JS, or reduced
 * motion) is the complete page rather than a stack of invisible sections.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';

/** Below this the pinned sideways tracks become plain vertical stacks. */
const DESKTOP = '(min-width: 861px)';

/**
 * Experiences pins, which makes anything below the fold unreachable while it is
 * held. Fourteen rows plus the clock will not fit a short laptop screen at a
 * type size worth reading, so the pin is gated on height as well as width and
 * short viewports get the same progressive reveal that phones get.
 */
const CAN_PIN_EXPERIENCES = '(min-width: 861px) and (min-height: 860px)';
const CANNOT_PIN_EXPERIENCES = '(max-width: 860px), (max-height: 859px)';

/**
 * The live clock.
 *
 * Runs regardless of motion preference — it is information, not decoration.
 * The server renders a placeholder, so this is also what makes the element
 * correct rather than merely animated.
 */
function startClock() {
  const el = document.querySelector<HTMLElement>('[data-clock]');
  if (!el) return;

  const timeZone = el.dataset.timezone || 'Asia/Singapore';
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const tick = () => {
    el.textContent = fmt.format(new Date());
  };
  tick();
  window.setInterval(tick, 1000);
}

/** Anchor links have to go through Lenis or they fight the smoothing. */
function wireAnchors(lenis: Lenis | null) {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (ev) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;

      ev.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: 0 });
      else target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/**
 * Line reveals. SplitText ships free from GSAP 3.13 and handles the mask
 * itself; where a heading cannot be split it simply stays as written.
 */
function splitReveals(ease: string) {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const split = new SplitText(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-mask',
    });
    const isHero = Boolean(el.closest('#hero'));

    gsap.set(split.lines, { yPercent: 108 });
    gsap.to(split.lines, {
      yPercent: 0,
      duration: 1.15,
      ease,
      stagger: 0.09,
      delay: isHero ? 0.15 : 0,
      scrollTrigger: isHero ? undefined : { trigger: el, start: 'top 82%', once: true },
    });
  });
}

/** Everything below the fold that simply arrives. */
function reveals(ease: string) {
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.set(el, { y: 26, autoAlpha: 0 });
    gsap.to(el, {
      y: 0,
      autoAlpha: 1,
      duration: 0.95,
      ease,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

/** The hero: three layers, three rates. */
function heroParallax(ease: string) {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const portrait = hero.querySelector<HTMLElement>('.hero-portrait');
  const img = hero.querySelector<HTMLElement>('[data-parallax-img]');
  const title = hero.querySelector<HTMLElement>('.hero-title');
  const intro = hero.querySelector<HTMLElement>('[data-hero-intro]');
  const foot = hero.querySelector<HTMLElement>('.hero-foot');
  const cue = hero.querySelector<HTMLElement>('.cue');

  gsap.set([intro, foot, cue], { autoAlpha: 0, y: 18 });
  gsap.to([intro, foot, cue], {
    autoAlpha: 1,
    y: 0,
    duration: 1,
    ease,
    delay: 0.75,
    stagger: 0.08,
  });

  gsap.set(portrait, { yPercent: 8, scale: 1.04, transformOrigin: '50% 50%' });
  gsap.to(portrait, { yPercent: 0, scale: 1, duration: 1.6, ease, delay: 0.1 });

  gsap
    .timeline({
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 },
    })
    .to(title, { yPercent: -18, ease: 'none' }, 0)
    .to(img, { yPercent: -14, ease: 'none' }, 0)
    .to(portrait, { yPercent: -6, ease: 'none' }, 0)
    .to([foot, cue], { autoAlpha: 0, ease: 'none' }, 0);
}

function counters() {
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const end = Number.parseInt(el.dataset.count ?? '0', 10);
    if (!Number.isFinite(end)) return;
    const suffix = el.dataset.suffix ?? '';

    const obj = { v: 0 };
    el.textContent = `0${suffix}`;
    gsap.to(obj, {
      v: end,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = `${Math.round(obj.v)}${suffix}`;
      },
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
}

/** The candidature drawing assembles itself once, on arrival. */
function blueprint(ease: string) {
  const svg = document.querySelector<SVGSVGElement>('.blueprint');
  if (!svg) return;

  const baseline = svg.querySelector('[data-draw]');
  const bar = svg.querySelector('[data-grow]');
  const nowLine = svg.querySelector('[data-now-line]');
  const nowDot = svg.querySelector('[data-now-dot]');
  const nowLabel = svg.querySelector('[data-now-label]');

  gsap
    .timeline({ scrollTrigger: { trigger: svg, start: 'top 80%', once: true } })
    .from(baseline, { scaleX: 0, transformOrigin: 'left center', duration: 1.1, ease })
    .from(bar, { scaleX: 0, transformOrigin: 'left center', duration: 1.2, ease }, 0.25)
    .from(nowLine, { scaleY: 0, transformOrigin: 'center bottom', duration: 0.7, ease }, 0.9)
    .from([nowDot, nowLabel], { autoAlpha: 0, duration: 0.5, ease: 'power2.out', stagger: 0.06 }, 1.1);
}

export function initMotion() {
  /* Information, not decoration — these run whatever the motion preference. */
  startClock();

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    /* Anchors still need to work; native smooth scrolling is already
       neutralised by the reduced-motion block in global.css. */
    wireAnchors(null);
    return;
  }

  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
  CustomEase.create('cinematic', '0.62, 0.05, 0.01, 0.99');
  const EASE = 'cinematic';

  /* Lenis drives ScrollTrigger rather than running alongside it, so scrubbed
     tweens stay locked to the smoothed position instead of the native one. */
  const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  wireAnchors(lenis);

  splitReveals(EASE);
  reveals(EASE);
  heroParallax(EASE);
  counters();
  blueprint(EASE);

  const mm = gsap.matchMedia();

  /* --- Tracks: pinned horizontal runs ------------------------------------ */
  /* Desktop only. A pinned sideways scroll on a phone fights the thumb. */
  mm.add(DESKTOP, () => {
    document.querySelectorAll<HTMLElement>('[data-track]').forEach((track) => {
      const vp = track.closest<HTMLElement>('[data-track-vp]');
      if (!vp) return;

      /* The gutter is a clamp(), so it has to be read off a laid-out element
         where it has resolved to pixels — parseFloat on the custom property
         itself returns NaN. One gutter for the left inset the track starts
         at, one so the last card does not finish flush against the edge. */
      const distance = () => {
        /* The gutter is a clamp(), so it has to be read off a laid-out element
           where it has resolved to pixels — parseFloat on the custom property
           itself returns NaN. It sits on the track as padding-left; the same
           amount again keeps the last card off the right edge. */
        const gutter = Number.parseFloat(getComputedStyle(track).paddingLeft) || 0;
        return Math.max(0, track.scrollWidth - window.innerWidth + gutter);
      };

      const intro = vp.querySelector<HTMLElement>('[data-track-intro]');

      /* --- Tracks without an opening beat --------------------------------- */
      if (!intro) {
        /* A track short enough to fit the screen has nothing to scroll
           sideways. Pinning it anyway would hold the viewport still for zero
           distance — a section that looks stuck. Those sit centred instead. */
        if (distance() <= 0) return;

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: vp,
            start: 'top top',
            end: () => '+=' + distance(),
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        /* Each photo drifts inside its frame against the track's direction —
           what keeps a sideways run from feeling like one rigid sheet. */
        track.querySelectorAll<HTMLElement>('[data-card-img]').forEach((img) => {
          const frame = img.parentElement;
          if (!frame) return;
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: 'none',
              scrollTrigger: {
                trigger: frame,
                containerAnimation: tween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          );
        });
        return;
      }

      /* --- Tracks that open with the picture contracting ------------------- */
      /* One pin covers both phases, which is the whole point: the overlay and
         the card it lands on are inside the same pinned viewport, so no amount
         of scrolling separates them. */
      const frame = intro.querySelector<HTMLElement>('[data-intro-frame]');
      const media = intro.querySelector<HTMLElement>('[data-intro-media]');
      const line = intro.querySelector<HTMLElement>('[data-intro-line]');
      const head = intro.querySelector<HTMLElement>('[data-intro-head]');

      /* Where the first card's picture sits inside this viewport. Measured, so
         changing a card width moves the landing with it on the next refresh. */
      const landing = () => {
        const img = track.querySelector<HTMLElement>('.card .card-img');
        if (!img) return null;
        const i = img.getBoundingClientRect();
        const box = intro.getBoundingClientRect();
        return { top: i.top - box.top, left: i.left - box.left, width: i.width, height: i.height };
      };

      if (!frame || !landing()) return;

      /* One screen of scroll for the contraction, then the sideways run. The
         split is fixed when the timeline is built; matchMedia rebuilds it on a
         width change, which is when card sizes actually move. */
      const introLen = window.innerHeight;
      const introFrac = introLen / Math.max(1, introLen + distance());
      const rest = 1 - introFrac;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: vp,
          start: 'top top',
          end: () => '+=' + (window.innerHeight + distance()),
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          /* The nav sits on espresso while the overlay covers the top of the
             screen, even though this section is a light one. */
          onUpdate: (self) => {
            document.documentElement.classList.toggle(
              'intro-dark',
              self.progress < introFrac * 0.78,
            );
          },
          /* onUpdate only fires once progress moves, so entering the pin has
             to set the state too or the nav is espresso-on-espresso for a
             frame. */
          onEnter: () => document.documentElement.classList.add('intro-dark'),
          onEnterBack: () => document.documentElement.classList.add('intro-dark'),
          onLeave: () => document.documentElement.classList.remove('intro-dark'),
          onLeaveBack: () => document.documentElement.classList.remove('intro-dark'),
        },
      });

      tl.to(line, { yPercent: -180, autoAlpha: 0, ease: 'none', duration: introFrac * 0.28 }, 0)
        .fromTo(
          frame,
          { top: 0, left: 0, width: () => intro.clientWidth, height: () => intro.clientHeight },
          {
            top: () => landing()!.top,
            left: () => landing()!.left,
            width: () => landing()!.width,
            height: () => landing()!.height,
            ease: 'none',
            duration: introFrac * 0.62,
          },
          0,
        )
        /* Settles the overscan as the frame closes, so the crop does not appear
           to slide while the box is shrinking around it. */
        .fromTo(
          media,
          { yPercent: -5 },
          { yPercent: 0, ease: 'none', duration: introFrac * 0.62 },
          0,
        )
        .fromTo(
          head,
          { autoAlpha: 0, y: 44 },
          { autoAlpha: 1, y: 0, ease: 'none', duration: introFrac * 0.26 },
          introFrac * 0.32,
        )
        /* The dissolve happens only once the picture is exactly on top of the
           card beneath it, so the photograph itself never moves or changes —
           what fades is the espresso ground around it and the heading. */
        .to(intro, { autoAlpha: 0, ease: 'none', duration: introFrac * 0.2 }, introFrac * 0.7)
        .to(track, { x: () => -distance(), ease: 'none', duration: rest }, introFrac)
        /* A uniform counter-drift rather than the per-card one: that needs a
           containerAnimation, which takes a tween and not a timeline. */
        .fromTo(
          track.querySelectorAll<HTMLElement>('[data-card-img]'),
          { xPercent: -5 },
          { xPercent: 5, ease: 'none', duration: rest },
          introFrac,
        );
    });
  });

  /* --- Experiences: scrub the index, count as it goes --------------------- */
  mm.add(CAN_PIN_EXPERIENCES, () => {
    const list = document.querySelector<HTMLElement>('[data-index-list]');
    const counter = document.querySelector<HTMLElement>('[data-index-count]');
    const section = document.getElementById('experiences');
    if (!list || !counter || !section) return;

    const rows = Array.from(list.children) as HTMLElement[];

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${rows.length * 110}`,
      pin: true,
      scrub: 0.5,
      onUpdate: (self) => {
        const i = Math.min(rows.length - 1, Math.floor(self.progress * rows.length));
        counter.textContent = String(i + 1).padStart(2, '0');
        rows.forEach((r, n) => r.classList.toggle('is-on', n <= i));
      },
    });
  });

  /* Where Experiences cannot pin, rows light up on their own as they arrive. */
  mm.add(CANNOT_PIN_EXPERIENCES, () => {
    const list = document.querySelector<HTMLElement>('[data-index-list]');
    const counter = document.querySelector<HTMLElement>('[data-index-count]');
    if (!list || !counter) return;

    (Array.from(list.children) as HTMLElement[]).forEach((row, n) => {
      ScrollTrigger.create({
        trigger: row,
        start: 'top 80%',
        onEnter: () => {
          row.classList.add('is-on');
          counter.textContent = String(n + 1).padStart(2, '0');
        },
      });
    });
  });

  /* Webfonts change line breaks, which changes every split. Re-measure once
     they land, and again after images have settled their heights. */
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
