import React, { useEffect } from "react";
import { useEventListener } from "./useEventListener";

export const useGameDirectionControl = (init) => {
  const directionRef = React.useRef(init);

  useEffect(() => {
    directionRef.current = init;
  }, [init]);

  const handleKeyEvents = React.useCallback((e) => {
    e.preventDefault();
    switch (e.code) {
      case "ArrowUp":
      case "KeyW": {
        directionRef.current = "up";
        break;
      }
      case "ArrowDown":
      case "KeyS": {
        directionRef.current = "down";
        break;
      }
      case "ArrowRight":
      case "KeyD": {
        directionRef.current = "right";
        break;
      }
      case "ArrowLeft":
      case "KeyA": {
        directionRef.current = "left";
        break;
      }
    }
  }, []);

  useEventListener("keydown", handleKeyEvents);

  return directionRef;
};
