import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { animated, to, useSprings } from '@react-spring/web';
import type { Project } from '../data/projects';

type ProjectCarouselProps = {
  projects: Project[];
};

/** How far apart the cards sit, and how hard they turn away from you. */
const ROTATION = 32; // degrees per step
const DEPTH = 200; // px pushed back per step
const VISIBLE = 2.2; // steps before a card has faded out entirely
const DRAG_THRESHOLD = 0.25; // fraction of a step that counts as a swipe

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Signed distance from the active card, wrapped so the set behaves as a ring.
 * Without this the first card would have every other card stacked to its right,
 * leaving the stage lopsided.
 */
function wrappedOffset(offset: number, count: number): number {
  const looped = ((offset % count) + count) % count;
  return looped > count / 2 ? looped - count : looped;
}

/**
 * Projects as a 3D carousel.
 *
 * The active card faces you; its neighbours are pushed back and turned on the
 * Y axis, so the set reads as a physical stack. Drag it, use the arrows, or
 * press the left/right keys. Every position is a spring, so a flick settles
 * rather than snapping.
 */
export default function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const count = projects.length;
  const stageRef = useRef<HTMLDivElement>(null);

  const [index, setIndex] = useState(0);
  const [stageWidth, setStageWidth] = useState(0);
  const [dragUnits, setDragUnits] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const drag = useRef({ startX: 0, active: false, moved: false, units: 0 });

  // Card geometry follows the stage, so this works at any width. Narrow
  // screens give the card a bigger share, or it ends up postage-stamp sized.
  const widthRatio = stageWidth && stageWidth < 640 ? 0.82 : 0.66;
  const cardWidth = stageWidth ? clamp(stageWidth * widthRatio, 200, 460) : 320;
  const spacing = cardWidth * 0.62;

  useEffect(() => {
    const element = stageRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => setStageWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const position = index - dragUnits;

  const styleFor = useCallback(
    (offset: number) => {
      const held = clamp(offset, -2.5, 2.5);
      return {
        x: held * spacing,
        z: -Math.abs(held) * DEPTH,
        rotateY: held * ROTATION,
        scale: Math.max(0.62, 1 - Math.abs(held) * 0.13),
        opacity: Math.abs(offset) > VISIBLE ? 0 : Math.max(0, 1 - Math.abs(offset) * 0.3),
      };
    },
    [spacing],
  );

  const [springs, api] = useSprings(count, (i) => ({
    ...styleFor(wrappedOffset(i - index, count)),
    config: { tension: 260, friction: 32, mass: 1 },
  }));

  useEffect(() => {
    api.start((i) => ({
      ...styleFor(wrappedOffset(i - position, count)),
      immediate: reducedMotion,
    }));
  }, [api, position, count, styleFor, reducedMotion]);

  // The ring has no ends, so the index runs freely and is wrapped on read.
  const go = useCallback((delta: number) => setIndex((previous) => previous + delta), []);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    drag.current = { startX: event.clientX, active: true, moved: false, units: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const dx = event.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;

    const units = dx / spacing;
    drag.current.units = units;
    setDragUnits(units);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const { units } = drag.current;
    setDragUnits(0);
    if (Math.abs(units) > DRAG_THRESHOLD) go(-Math.sign(units));
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(-1);
    }
  };

  const activeIndex = ((index % count) + count) % count;
  const active = projects[activeIndex];

  return (
    <div>
      <div
        ref={stageRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Projects"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative h-[430px] cursor-grab touch-pan-y select-none active:cursor-grabbing md:h-[520px]"
        style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
      >
        {springs.map((spring, i) => {
          const project = projects[i];
          if (!project) return null;

          const isActive = i === activeIndex;
          const offset = Math.abs(wrappedOffset(i - position, count));

          return (
            <animated.div
              key={project.slug}
              style={{
                width: cardWidth,
                left: '50%',
                marginLeft: -cardWidth / 2,
                opacity: spring.opacity,
                zIndex: Math.round(100 - offset * 10),
                transform: to(
                  [spring.x, spring.z, spring.rotateY, spring.scale],
                  (x, z, rotateY, scale) =>
                    `translate3d(${x}px, 0px, ${z}px) rotateY(${rotateY}deg) scale(${scale})`,
                ),
                pointerEvents: offset > VISIBLE ? 'none' : 'auto',
              }}
              className="absolute top-0 will-change-transform"
            >
              <a
                href={project.href}
                tabIndex={isActive ? 0 : -1}
                aria-hidden={!isActive}
                onClick={(event) => {
                  // A drag is not a click, and an off-centre card is a target
                  // to bring forward rather than a link to follow.
                  if (drag.current.moved) {
                    event.preventDefault();
                    return;
                  }
                  if (!isActive) {
                    event.preventDefault();
                    setIndex(i);
                  }
                }}
                className={`block border border-hairline bg-chalk-deep transition-shadow duration-300 ${
                  isActive
                    ? 'shadow-[0_24px_60px_-24px_rgba(22,23,26,0.45)]'
                    : 'shadow-[0_8px_24px_-16px_rgba(22,23,26,0.35)]'
                }`}
              >
                <img
                  src={project.image}
                  alt={project.imageAlt}
                  draggable={false}
                  loading={i < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="aspect-[4/3] w-full bg-chalk-deep object-cover"
                />

                <div className="bg-chalk px-5 py-5">
                  <h3 className="text-title">{project.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate">{project.summary}</p>
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <p className="eyebrow">{project.role}</p>
                    <p className="eyebrow">{project.year}</p>
                  </div>
                </div>
              </a>
            </animated.div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="mt-10 flex items-center justify-between gap-6">
        <p className="eyebrow tabular-nums">
          {String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous project"
            className="flex size-11 items-center justify-center border border-hairline transition-colors duration-200 hover:border-ink"
          >
            <span aria-hidden="true">&#8592;</span>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next project"
            className="flex size-11 items-center justify-center border border-hairline transition-colors duration-200 hover:border-ink"
          >
            <span aria-hidden="true">&#8594;</span>
          </button>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {active ? `Project ${index + 1} of ${count}: ${active.title}` : ''}
      </p>
    </div>
  );
}
