import { useEffect, useRef, useState } from 'react';

import {
  randomTimmyChokeDelayMs,
  TIMMY_BREATH_COUNTDOWN_SECONDS,
} from '@/src/systems/timmy-rescue';

export type TimmyChokePhase = 'waiting' | 'choking' | 'rescued' | 'failed';

type UseTimmySteakChokingOptions = {
  ready: boolean;
  sessionKey: number;
  onChokeStart?: () => void;
  onChokeFailed?: () => void;
};

export function useTimmySteakChoking({
  ready,
  sessionKey,
  onChokeStart,
  onChokeFailed,
}: UseTimmySteakChokingOptions) {
  const [phase, setPhase] = useState<TimmyChokePhase>('waiting');
  const [breathRemaining, setBreathRemaining] = useState(TIMMY_BREATH_COUNTDOWN_SECONDS);
  const onChokeStartRef = useRef(onChokeStart);
  const onChokeFailedRef = useRef(onChokeFailed);
  onChokeStartRef.current = onChokeStart;
  onChokeFailedRef.current = onChokeFailed;

  useEffect(() => {
    setPhase('waiting');
    setBreathRemaining(TIMMY_BREATH_COUNTDOWN_SECONDS);
  }, [sessionKey]);

  useEffect(() => {
    if (!ready || phase !== 'waiting') {
      return undefined;
    }

    const timer = setTimeout(() => {
      setPhase('choking');
      onChokeStartRef.current?.();
    }, randomTimmyChokeDelayMs());

    return () => clearTimeout(timer);
  }, [phase, ready, sessionKey]);

  useEffect(() => {
    if (!ready || phase !== 'choking') {
      return undefined;
    }

    setBreathRemaining(TIMMY_BREATH_COUNTDOWN_SECONDS);

    const interval = setInterval(() => {
      setBreathRemaining((current) => {
        if (current <= 1) {
          clearInterval(interval);
          setPhase('failed');
          onChokeFailedRef.current?.();
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, ready, sessionKey]);

  const completeRescue = () => {
    setPhase('rescued');
    setBreathRemaining(0);
  };

  return {
    phase,
    breathRemaining,
    isChoking: phase === 'choking',
    timmyRescued: phase === 'rescued',
    chokeFailed: phase === 'failed',
    completeRescue,
  };
}
