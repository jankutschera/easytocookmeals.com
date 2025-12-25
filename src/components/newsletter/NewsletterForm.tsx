'use client';

import { useState, FormEvent } from 'react';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Thank you for subscribing!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div>
      {status === 'success' ? (
        <div className="bg-sage-500/20 border border-sage-400 rounded-organic p-6 text-center">
          <div className="text-4xl mb-3">🌿</div>
          <p className="text-parchment font-body text-lg">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            disabled={status === 'loading'}
            className="flex-1 px-6 py-4 rounded-organic border-2 border-sand-300 focus:border-terracotta-500 focus:outline-none font-body text-ink disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-8 py-4 bg-terracotta-500 hover:bg-terracotta-600 text-white font-display rounded-organic transition-all duration-300 hover:shadow-warm-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="text-terracotta-400 text-sm font-body text-center mt-2">
          {message}
        </p>
      )}

      {status !== 'success' && (
        <p className="text-sm text-sand-300 font-body text-center">
          No spam, ever. Unsubscribe anytime.
        </p>
      )}
    </div>
  );
}
