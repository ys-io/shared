import { useState, useCallback, useEffect, useRef } from "react";
import { OTP_DURATION } from "../constans/defaults";

export function useOtpTimer() {
  const [remaining, setRemaining] = useState(OTP_DURATION);
  const [expired, setExpired] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    stop();
    setExpired(false);
    setRemaining(OTP_DURATION);
    timerRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          stop();
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stop]);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return { remaining, expired, formatTime, restart: start };
}
