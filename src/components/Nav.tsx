import { useCallback, useEffect, useRef, useState } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { navItems } from '../data/site';

type NavProps = {
  /** Current URL path, passed in from Astro so the island knows what is active. */
  pathname: string;
  name: string;
};

function isActive(href: string, pathname: string): boolean {
  const current = pathname.replace(/\/+$/, '') || '/';
  return href === '/' ? current === '/' : current.startsWith(href);
}

/**
 * Site navigation.
 *
 * The underline is a single element that springs between links — it follows
 * your pointer and settles back on the current page when you leave. That
 * physics is the reason this is a React island rather than plain markup.
 */
export default function Nav({ pathname, name }: NavProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const hasMeasured = useRef(false);

  const [hovered, setHovered] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const activeIndex = navItems.findIndex((item) => isActive(item.href, pathname));
  const target = hovered ?? (activeIndex >= 0 ? activeIndex : null);

  const [underline, underlineApi] = useSpring(() => ({
    x: 0,
    width: 0,
    opacity: 0,
    config: { tension: 320, friction: 30, mass: 0.9 },
  }));

  const measure = useCallback(() => {
    if (target === null) {
      underlineApi.start({ opacity: 0 });
      return;
    }

    const link = linkRefs.current[target];
    if (!link || !listRef.current) return;

    // Skip the slide on the very first paint — it should already be in place.
    const immediate = !hasMeasured.current;
    hasMeasured.current = true;

    underlineApi.start({
      x: link.offsetLeft,
      width: link.offsetWidth,
      opacity: 1,
      immediate: (key) => immediate && key !== 'opacity',
    });
  }, [target, underlineApi]);

  useEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    window.addEventListener('resize', measure);
    void document.fonts?.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile panel on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || menuOpen
          ? 'border-b border-hairline bg-ground/80 backdrop-blur-md'
          : 'border-b border-transparent'
      }`}
    >
      <nav aria-label="Main" className="shell flex items-center justify-between py-5">
        <a
          href="/"
          className="font-display text-base font-medium tracking-tight transition-opacity hover:opacity-60"
        >
          {name}
        </a>

        {/* Desktop links */}
        <ul
          ref={listRef}
          className="relative hidden items-center gap-8 md:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {navItems.map((item, index) => (
            <li key={item.href}>
              <a
                ref={(node) => {
                  linkRefs.current[index] = node;
                }}
                href={item.href}
                aria-current={index === activeIndex ? 'page' : undefined}
                onMouseEnter={() => setHovered(index)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
                className={`block py-1 text-sm transition-colors duration-200 ${
                  index === activeIndex ? 'text-chalk' : 'text-slate hover:text-chalk'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}

          <animated.span
            aria-hidden="true"
            style={{
              transform: underline.x.to((x) => `translate3d(${x}px, 0, 0)`),
              width: underline.width,
              opacity: underline.opacity,
            }}
            className="absolute bottom-0 left-0 h-px bg-accent"
          />
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="eyebrow md:hidden"
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </nav>

      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="border-t border-hairline bg-ground md:hidden"
      >
        <ul className="shell flex flex-col py-2">
          {navItems.map((item, index) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={index === activeIndex ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between border-b border-hairline py-4 text-title last:border-b-0 ${
                  index === activeIndex ? 'text-chalk' : 'text-slate'
                }`}
              >
                {item.label}
                {index === activeIndex && (
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
