import { useEffect, useRef, useState } from 'react';

const FART_CHECK_MS = 4000;
const FART_CHANCE = 0.38;
const FART_VISIBLE_MS = 2400;

type UseTimmyFartOptions = {
  active: boolean;
  sessionKey: number;
  onFart: () => void;
};

export function useTimmyFart({ active, sessionKey, onFart }: UseTimmyFartOptions) {
  const [fartKey, setFartKey] = useState(0);
  const [isFarting, setIsFarting] = useState(false);
  const isFartingRef = useRef(false);
  const onFartRef = useRef(onFart);
  onFartRef.current = onFart;

  useEffect(() => {
    isFartingRef.current = false;
    setIsFarting(false);
  }, [sessionKey]);

  useEffect(() => {
    if (!active) {
      isFartingRef.current = false;
      setIsFarting(false);
      return undefined;
    }

    const interval = setInterval(() => {
      if (isFartingRef.current) {
        return;
      }

      if (Math.random() > FART_CHANCE) {
        return;
      }

      isFartingRef.current = true;
      setIsFarting(true);
      setFartKey((key) => key + 1);
      onFartRef.current();

      setTimeout(() => {
        isFartingRef.current = false;
        setIsFarting(false);
      }, FART_VISIBLE_MS);
    }, FART_CHECK_MS);

    return () => {
      clearInterval(interval);
    };
  }, [active, sessionKey]);

  return {
    fartKey,
    isFarting,
  };
}

export const TIMMY_FART_MIEF_SPIKE = 5;
