import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Deadline-based training timer shared by each Gabor exercise. The interval is
 * always cleared when the module unmounts or the active session ends.
 */
export default function useTrainingTimer({
  durationSeconds,
  active = true,
  sessionKey = 0,
  onComplete,
}) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const deadlineRef = useRef(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!active) {
      deadlineRef.current = null;
      return undefined;
    }

    completedRef.current = false;
    deadlineRef.current = Date.now() + durationSeconds * 1000;
    setSecondsLeft(durationSeconds);

    let timerId = 0;

    const tick = () => {
      if (deadlineRef.current === null) return;

      const millisecondsLeft = deadlineRef.current - Date.now();
      const nextSeconds = Math.max(0, Math.ceil(millisecondsLeft / 1000));
      setSecondsLeft(nextSeconds);

      if (millisecondsLeft <= 0 && !completedRef.current) {
        completedRef.current = true;
        deadlineRef.current = null;
        window.clearInterval(timerId);
        onCompleteRef.current?.();
      }
    };

    tick();
    timerId = window.setInterval(tick, 250);

    return () => {
      window.clearInterval(timerId);
      deadlineRef.current = null;
    };
  }, [active, durationSeconds, sessionKey]);

  const penalize = useCallback((seconds) => {
    if (deadlineRef.current === null || completedRef.current) return;

    deadlineRef.current -= seconds * 1000;
    const millisecondsLeft = deadlineRef.current - Date.now();
    const nextSeconds = Math.max(0, Math.ceil(millisecondsLeft / 1000));
    setSecondsLeft(nextSeconds);

    if (millisecondsLeft <= 0 && !completedRef.current) {
      completedRef.current = true;
      deadlineRef.current = null;
      onCompleteRef.current?.();
    }
  }, []);

  const elapsedFraction =
    durationSeconds > 0
      ? Math.min(1, Math.max(0, 1 - secondsLeft / durationSeconds))
      : 0;

  return {
    secondsLeft,
    elapsedFraction,
    penalize,
  };
}
