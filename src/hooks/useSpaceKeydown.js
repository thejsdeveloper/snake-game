import { useCallback } from "react";
import { useEventListener } from "./useEventListener";

export const useSpaceKeydown = (cb) => {
  const handleSpaceKey = useCallback(
    (e) => {
      e.preventDefault();
      if (e.code.toLowerCase() !== "space") {
        return;
      }
      cb();
    },
    [cb]
  );

  return useEventListener("keydown", handleSpaceKey);
};
