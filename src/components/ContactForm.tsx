import { useState, type SubmitEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

/**
 * The form endpoint. Submissions POST here as FormData with an
 * `Accept: application/json` header, which is what Formspree expects.
 * Setting this back to null makes the form validate and then say plainly that
 * nothing was sent, rather than pretending to deliver.
 */
const FORM_ENDPOINT: string | null = 'https://formspree.io/f/mvkgazqy';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [note, setNote] = useState('');
  const reduced = useReducedMotion();

  async function onSubmit(ev: SubmitEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const data = new FormData(form);

    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    if (!name || !email || !message) {
      setStatus('error');
      setNote('Fill in your name, email and a message before sending.');
      return;
    }
    if (email.indexOf('@') < 1 || email.lastIndexOf('.') < email.indexOf('@')) {
      setStatus('error');
      setNote('That email address is missing an @ or a domain.');
      return;
    }

    if (!FORM_ENDPOINT) {
      setStatus('sent');
      setNote('Checks out — but the form is not wired to an endpoint yet, so nothing left your browser. Email me directly for now.');
      form.reset();
      return;
    }

    setStatus('sending');
    setNote('');
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      setNote('Sent. I will get back to you.');
      form.reset();
    } catch {
      setStatus('error');
      setNote('That did not send. Email me directly instead.');
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <label className="field" htmlFor="cf-name">
        <span className="meta">Name</span>
        <input id="cf-name" name="name" type="text" autoComplete="name" required />
      </label>

      <label className="field" htmlFor="cf-email">
        <span className="meta">Email</span>
        <input id="cf-email" name="email" type="email" autoComplete="email" required />
      </label>

      <label className="field" htmlFor="cf-message">
        <span className="meta">Message</span>
        <textarea id="cf-message" name="message" rows={4} required />
      </label>

      <motion.button
        className="send"
        type="submit"
        disabled={status === 'sending'}
        whileHover={reduced ? undefined : { opacity: 0.82 }}
        whileTap={reduced ? undefined : { scale: 0.99 }}
        transition={{ duration: 0.25, ease: [0.62, 0.05, 0.01, 0.99] }}
      >
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </motion.button>

      <AnimatePresence mode="wait">
        {note && (
          <motion.p
            key={note}
            className="form-note meta"
            role="status"
            aria-live="polite"
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.62, 0.05, 0.01, 0.99] }}
          >
            {note}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
