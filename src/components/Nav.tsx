import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { NavItem } from '../data/site';

interface Props {
  name: string;
  items: NavItem[];
}

/**
 * The only always-on React island on the page.
 *
 * It is here for state, not decoration: the mobile panel needs open/closed,
 * and the bar needs to know which theme it is currently sitting over. Framer
 * Motion handles the panel because it is an enter/exit transition, which is
 * exactly what GSAP is clumsy at and Framer is built for.
 *
 * The theme inversion below deliberately ignores prefers-reduced-motion. A
 * cream bar over a cream section is unreadable, so the swap is legibility
 * rather than decoration — only its 0.45s CSS transition is motion, and that
 * is already neutralised by the reduced-motion block in global.css.
 */
export default function Nav({ name, items }: Props) {
  const [open, setOpen] = useState(false);
  const [onLight, setOnLight] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('[data-theme]');
    if (!sections.length || !('IntersectionObserver' in window)) return;

    /* A one-line band just under the nav bar. Whichever section crosses it
       owns the bar's colour. */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setOnLight((e.target as HTMLElement).dataset.theme === 'light');
          }
        });
      },
      { rootMargin: '-8% 0px -92% 0px', threshold: 0 },
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  /* A locked body would fight Lenis, so the panel stops Lenis itself. */
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <nav className={`nav${onLight && !open ? ' on-light' : ''}`} id="nav">
        <a className="nav-mark" href="#top">
          {name}
        </a>

        <div className="nav-links">
          {items.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>

        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="nav-panel"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav-panel"
            id="nav-panel"
            initial={reduced ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.62, 0.05, 0.01, 0.99] }}
          >
            {items.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: reduced ? 0 : 0.08 + i * 0.05,
                  ease: [0.62, 0.05, 0.01, 0.99],
                }}
              >
                {item.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
