'use client';

import { useEffect, useState } from 'react';

type UseTypewriterOptions = {
  typingMs?: number;
  deletingMs?: number;
  pauseAfterTypeMs?: number;
  pauseAfterDeleteMs?: number;
  enabled?: boolean;
};

export function useTypewriter(
  phrases: readonly string[],
  {
    typingMs = 58,
    deletingMs = 32,
    pauseAfterTypeMs = 2400,
    pauseAfterDeleteMs = 380,
    enabled = true,
  }: UseTypewriterOptions = {}
) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!enabled || phrases.length === 0) return;

    const current = phrases[index] ?? '';

    if (!deleting && text === current) {
      const t = window.setTimeout(() => setDeleting(true), pauseAfterTypeMs);
      return () => window.clearTimeout(t);
    }

    if (deleting && text === '') {
      const t = window.setTimeout(() => {
        setDeleting(false);
        setIndex((i) => (i + 1) % phrases.length);
      }, pauseAfterDeleteMs);
      return () => window.clearTimeout(t);
    }

    const t = window.setTimeout(
      () => {
        setText((prev) =>
          deleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1)
        );
      },
      deleting ? deletingMs : typingMs
    );

    return () => window.clearTimeout(t);
  }, [
    text,
    deleting,
    index,
    phrases,
    enabled,
    typingMs,
    deletingMs,
    pauseAfterTypeMs,
    pauseAfterDeleteMs,
  ]);

  useEffect(() => {
    if (!enabled) setText('');
  }, [enabled]);

  return text;
}
