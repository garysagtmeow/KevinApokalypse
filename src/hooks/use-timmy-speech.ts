import { useEffect, useRef, useState } from 'react';

import {
  pickTimmySpeechLine,
  randomBubbleDurationMs,
  type TimmySpeechContext,
} from '@/src/systems/timmy-speech';

const CHECK_INTERVAL_MS = 2200;
const BASE_SPAWN_CHANCE = 0.74;
const CHOKING_SPAWN_CHANCE = 0.85;

type UseTimmySpeechOptions = {
  active: boolean;
  suppressSpawns?: boolean;
  context: TimmySpeechContext;
  sessionKey: number;
};

export function useTimmySpeech({
  active,
  suppressSpawns = false,
  context,
  sessionKey,
}: UseTimmySpeechOptions) {
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [bubbleKey, setBubbleKey] = useState(0);
  const lastQuoteIdRef = useRef<string | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showingRef = useRef(false);
  const suppressSpawnsRef = useRef(suppressSpawns);
  const contextRef = useRef(context);
  contextRef.current = context;
  suppressSpawnsRef.current = suppressSpawns;

  const clearBubbleTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const hideBubble = () => {
    clearBubbleTimer();
    showingRef.current = false;
    setBubbleText(null);
  };

  const showBubble = (text: string, quoteId: string) => {
    clearBubbleTimer();
    lastQuoteIdRef.current = quoteId;
    showingRef.current = true;
    setBubbleKey((key) => key + 1);
    setBubbleText(text);

    hideTimerRef.current = setTimeout(() => {
      showingRef.current = false;
      setBubbleText(null);
      hideTimerRef.current = null;
    }, randomBubbleDurationMs());
  };

  useEffect(() => {
    hideBubble();
    lastQuoteIdRef.current = null;

    return () => {
      clearBubbleTimer();
    };
  }, [sessionKey]);

  useEffect(() => {
    if (!active) {
      hideBubble();
      return undefined;
    }

    const interval = setInterval(() => {
      if (showingRef.current || suppressSpawnsRef.current) {
        return;
      }

      const currentContext = contextRef.current;
      const spawnChance = currentContext.isChoking ? CHOKING_SPAWN_CHANCE : BASE_SPAWN_CHANCE;

      if (Math.random() > spawnChance) {
        return;
      }

      const quote = pickTimmySpeechLine(currentContext, lastQuoteIdRef.current ?? undefined);
      showBubble(quote.text, quote.id);
    }, CHECK_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [active, sessionKey]);

  return {
    bubbleText,
    bubbleKey,
  };
}
