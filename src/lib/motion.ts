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
 * Involvements holds each commitment's list beside a photo frame, and the list
 * has to fit the held view with one event's details open. That needs width for
 * the two columns and height for the list, so the held layout is gated on both;
 * everything else gets the stacked layout with openers that only grow. Raise
 * the height if a chapter gains enough events to overflow at this size.
 */
const CAN_STAGE_COMMITMENTS = '(min-width: 861px) and (min-height: 720px)';
const CANNOT_STAGE_COMMITMENTS = '(max-width: 860px), (max-height: 719px)';

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

/**
 * Involvements, held. `.is-staged` switches global.css to the held layout;
 * this drives it. Everything it changes is undone in the returned cleanup, so
 * crossing the breakpoint returns the stacked layout cleanly.
 */
function stageCommitments(section: HTMLElement) {
  section.classList.add('is-staged');

  /* Screens of scroll per photo and per opener hold. Read from the stylesheet
     so the heights there and the timings here share one number. */
  const hold =
    Number.parseFloat(getComputedStyle(section).getPropertyValue('--commit-hold')) || 0.67;

  /* The opener: one screen to open out as it arrives, then `hold` screens held
     full while the photo settles. One timeline over the opener's whole height,
     so the two phases share a single scroll mapping. */
  section.querySelectorAll<HTMLElement>('[data-cm-open]').forEach((open) => {
    const frame = open.querySelector('[data-cm-open-frame]');
    const media = open.querySelector('[data-cm-open-media]');
    const title = open.querySelector('[data-cm-open-title]');
    if (!frame || !media || !title) return;

    gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: open,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
      .fromTo(frame, { clipPath: 'inset(22% 28% 22% 28%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 }, 0)
      .fromTo(media, { scale: 1.25 }, { scale: 1.04, duration: 1 }, 0)
      .fromTo(title, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.65)
      .to(media, { scale: 1, duration: hold }, 1);
  });

  const timers: number[] = [];

  /* The run: the view is sticky in CSS, so nothing pins. Progress through the
     run's height picks the beat — one per photo. An event without a photo has
     a placeholder frame of its own, so every event gets its own element and
     every change of event wipes. Two events sharing one element would not:
     show() only runs when the element changes. */
  section.querySelectorAll<HTMLElement>('[data-cm-run]').forEach((run, r) => {
    const short = run.closest<HTMLElement>('[data-cm-chapter]')?.dataset.short ?? '';
    const bar = run.querySelector<HTMLElement>('[data-cm-bar]');
    const capL = run.querySelector<HTMLElement>('[data-cm-cap-l]');
    const capR = run.querySelector<HTMLElement>('[data-cm-cap-r]');
    const rows = Array.from(run.querySelectorAll<HTMLElement>('[data-cm-row]'));
    if (!bar || !capL || !capR || !rows.length) return;

    type Beat = { row: number; k: number; n: number; shot: HTMLElement; img: HTMLElement | null };
    const beats: Beat[] = [];
    rows.forEach((row, i) => {
      const shots = Array.from(row.querySelectorAll<HTMLElement>('[data-cm-shot]'));
      shots.forEach((shot, k) =>
        beats.push({ row: i, k, n: shots.length, shot, img: shot.querySelector('img') }),
      );
    });
    const ticks = rows.map((row) => Array.from(row.querySelectorAll<HTMLElement>('.cm-ticks i')));

    let beat = -1;
    let shown: HTMLElement | null = null;
    let z = 1;

    /* A new photo wipes up over the last. The ones beneath are cleared once it
       has landed, so scrolling back wipes them in again rather than cutting. */
    const show = (shot: HTMLElement) => {
      shot.classList.remove('is-on');
      void shot.offsetWidth;
      z += 1;
      shot.style.zIndex = String(z);
      shot.classList.add('is-on');
      const top = z;
      window.clearTimeout(timers[r]);
      timers[r] = window.setTimeout(() => {
        beats.forEach(({ shot: s }) => {
          if (Number(s.style.zIndex) < top) s.classList.remove('is-on');
        });
      }, 1000);
    };

    const render = (progress: number) => {
      const f = progress * beats.length;
      const i = Math.min(beats.length - 1, Math.floor(f));
      const b = beats[i];

      if (i !== beat) {
        beat = i;
        rows.forEach((row, n) => {
          row.classList.toggle('is-on', n === b.row);
          row.classList.toggle('is-done', n < b.row);
        });
        ticks.forEach((set, n) =>
          set.forEach((t, k) => t.classList.toggle('is-on', n < b.row || (n === b.row && k <= b.k))),
        );
        if (b.shot !== shown) {
          shown = b.shot;
          show(b.shot);
        }
        const { name = '', year = '' } = rows[b.row].dataset;
        capL.textContent = `${short} · ${name}`;
        capR.textContent = b.n > 1 ? `${year} · ${b.k + 1} / ${b.n}` : year;
      }

      /* The photo settles while it is held, so a long hold never looks frozen,
         and the line under the frame shows how much of the hold is left. */
      const sub = Math.min(1, Math.max(0, f - i));
      if (b.img) gsap.set(b.img, { scale: 1.08 - 0.08 * sub });
      gsap.set(bar, { scaleX: sub });
    };

    ScrollTrigger.create({
      trigger: run,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => render(self.progress),
      onRefresh: (self) => render(self.progress),
    });
    render(0);
  });

  return () => {
    timers.forEach((t) => window.clearTimeout(t));
    section.classList.remove('is-staged');
    section.querySelectorAll('.is-on, .is-done').forEach((el) => el.classList.remove('is-on', 'is-done'));
    section.querySelectorAll<HTMLElement>('[data-cm-shot]').forEach((s) => {
      s.style.zIndex = '';
    });
    section.querySelectorAll('[data-cm-cap-l], [data-cm-cap-r]').forEach((c) => {
      c.textContent = '';
    });
    /* render() runs on scroll, after this context stopped recording, so its
       sets are not reverted with the rest and have to be cleared by hand. */
    gsap.set(section.querySelectorAll('.cm-shot img, [data-cm-bar]'), { clearProps: 'transform' });
  };
}

/**
 * Involvements, stacked — phones, short screens. Nothing holds: each opener
 * grows open as it arrives, and each photo rises in with the same tween
 * `data-reveal` uses. That tween is applied here rather than by giving the
 * photos `data-reveal`, which runs in every mode and would fight the held one.
 */
function stackCommitments(section: HTMLElement, ease: string) {
  section.querySelectorAll<HTMLElement>('[data-cm-open]').forEach((open) => {
    const frame = open.querySelector('[data-cm-open-frame]');
    const media = open.querySelector('[data-cm-open-media]');
    const title = open.querySelector('[data-cm-open-title]');
    if (!frame || !media || !title) return;

    gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'top 20%', scrub: 0.6 },
      })
      .fromTo(frame, { clipPath: 'inset(14% 18% 14% 18%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 }, 0)
      .fromTo(media, { scale: 1.2 }, { scale: 1, duration: 1 }, 0)
      .fromTo(title, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.65);
  });

  /* Placeholder frames are held-layout only and hidden here, so skip them. */
  section.querySelectorAll<HTMLElement>('[data-cm-shot]:not(.cm-shot-ph)').forEach((shot) => {
    gsap.fromTo(
      shot,
      { y: 26, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.95,
        ease,
        scrollTrigger: { trigger: shot, start: 'top 88%', once: true },
      },
    );
  });
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

      const distance = () => {
        /* The gutter is a clamp(), so it has to be read off a laid-out element
           where it has resolved to pixels — parseFloat on the custom property
           itself returns NaN. It sits on the track as padding-left; the same
           amount again keeps the last card off the right edge. */
        const gutter = Number.parseFloat(getComputedStyle(track).paddingLeft) || 0;
        return Math.max(0, track.scrollWidth - window.innerWidth + gutter);
      };

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
    });
  });

  /* --- Involvements: openers, then the held photo frame ------------------ */
  const commitments = document.querySelector<HTMLElement>('[data-commitments]');
  if (commitments) {
    mm.add(CAN_STAGE_COMMITMENTS, () => stageCommitments(commitments));
    mm.add(CANNOT_STAGE_COMMITMENTS, () => stackCommitments(commitments, EASE));
  }

  /* Webfonts change line breaks, which changes every split. Re-measure once
     they land, and again after images have settled their heights. */
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
