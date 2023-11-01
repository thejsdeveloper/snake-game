import { useEffect, useRef } from "react";

export const useInterval = (cb, interval) => {
  const savedCallback = useRef(cb);
  const intervalIdRef = useRef(null);

  useEffect(() => {
    savedCallback.current = cb;
  }, [cb]);

  useEffect(() => {
    const tick = () => savedCallback.current();
    if (typeof interval === "number") {
      intervalIdRef.current = setInterval(tick, interval);
      return () => window.clearInterval(intervalIdRef.current);
    }
  }, [interval]);

  return intervalIdRef;
};
