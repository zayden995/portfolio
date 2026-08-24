import { useState } from 'react';
import type { SubmitEvent } from 'react';

/**
 * Where the form posts.
 *
 * Leave this empty and the form stays honest — it tells the visitor it isn't
 * connected and points them at your email instead. Paste in a form endpoint
 * (Formspree, Basin, Netlify Forms, your own handler) and it starts sending.
 */
const FORM_ENDPOINT = '';

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'not-connected';

const FIELD_CLASSES =
  'w-full border-b border-hairline bg-transparent py-3 text-chalk placeholder:text-slate/60 transition-colors duration-200 focus:border-accent focus:outline-none';

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!FORM_ENDPOINT) {
      setStatus('not-connected');
      return;
    }

    // Hold onto the form: React clears `currentTarget` once the handler yields.
    const form = event.currentTarget;
    setStatus('sending');

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });

      if (!response.ok) throw new Error(`Request failed with ${response.status}`);

      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  const message: Record<Status, string> = {
    idle: '',
    sending: 'Sending…',
    sent: 'Message sent. I’ll get back to you shortly.',
    error: 'That didn’t send. Try again, or email me directly.',
    'not-connected':
      'This form isn’t connected yet — add your endpoint to FORM_ENDPOINT in src/components/ContactForm.tsx. In the meantime, email works.',
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <div className="space-y-8">
        <div>
          <label htmlFor="name" className="eyebrow block">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Ada Lovelace"
            className={`${FIELD_CLASSES} mt-2`}
          />
        </div>

        <div>
          <label htmlFor="email" className="eyebrow block">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="ada@example.com"
            className={`${FIELD_CLASSES} mt-2`}
          />
        </div>

        <div>
          <label htmlFor="message" className="eyebrow block">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            placeholder="What are you working on?"
            className={`${FIELD_CLASSES} mt-2 resize-y`}
          />
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="group inline-flex items-center gap-3 bg-chalk px-7 py-3.5 text-sm text-ground transition-colors duration-200 hover:bg-accent disabled:opacity-60"
        >
          Send message
          <span
            aria-hidden="true"
            className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
          >
            &#8594;
          </span>
        </button>
      </div>

      <p aria-live="polite" className="mt-6 min-h-6 text-sm text-slate">
        {message[status]}
      </p>
    </form>
  );
}
