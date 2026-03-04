import { useEffect, useRef, useState } from 'react';

const DEFAULT_CHARS_PER_SECOND = 45;

interface UseTypingAnimationOptions {
  charsPerSecond?: number;
  resetKey?: string | number;
}

/**
 * Returns a substring of targetText that advances over time for a typing effect.
 * Only advances while isActive is true; use resetKey (e.g. message.id) to reset when the message changes.
 */
export function useTypingAnimation(
  targetText: string,
  isActive: boolean,
  options: UseTypingAnimationOptions = {}
): string {
  const { charsPerSecond = DEFAULT_CHARS_PER_SECOND, resetKey } = options;

  const [displayedLength, setDisplayedLength] = useState(0);
  const lengthRef = useRef(0);
  const lastTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number>(0);
  const targetTextRef = useRef(targetText);
  targetTextRef.current = targetText;

  const targetLength = targetText.length;

  // Reset displayed length when message (resetKey) changes
  useEffect(() => {
    if (resetKey !== undefined) {
      lengthRef.current = 0;
      setDisplayedLength(0);
    }
  }, [resetKey]);

  // Animation loop: advance displayed length toward target length.
  // Depend on targetLength (not targetText) so we don't restart the loop every render when messageContent is a new string reference.
  useEffect(() => {
    if (!isActive || lengthRef.current >= targetLength) return;

    const tick = (now: number): void => {
      const deltaMs = now - lastTimeRef.current;
      lastTimeRef.current = now;
      const len = targetTextRef.current.length;

      const advance = (charsPerSecond * deltaMs) / 1000;
      lengthRef.current = Math.min(lengthRef.current + advance, len);
      const newRounded = Math.round(lengthRef.current);

      setDisplayedLength((prev) => {
        if (newRounded !== prev) return newRounded;
        return prev;
      });

      if (lengthRef.current < len) {
        rafIdRef.current = requestAnimationFrame(tick);
      }
    };

    lastTimeRef.current = performance.now();
    rafIdRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafIdRef.current);
  }, [isActive, targetLength, charsPerSecond]);

  // When targetText grows (new chunks), we keep animating; when it shrinks (e.g. reset), cap displayedLength
  const safeLength = Math.min(displayedLength, targetText.length);
  return targetText.slice(0, Math.round(safeLength));
}
