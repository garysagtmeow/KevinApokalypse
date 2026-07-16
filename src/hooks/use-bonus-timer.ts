import { useEffect, useState } from 'react';

export function useBonusTimer(durationSeconds: number, active: boolean, resetKey: number) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setRemaining(durationSeconds);
    setFinished(false);
  }, [durationSeconds, resetKey]);

  useEffect(() => {
    if (!active || finished) {
      return;
    }

    const interval = setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          setFinished(true);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [active, finished]);

  return { remaining, finished };
}
