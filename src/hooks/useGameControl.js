import React from "react";

export const useGameControl = (init) => {
  const directionRef = React.useRef(init);
  const handlekeyEvents = React.useCallback((e) => {
    e.preventDefault();
    switch (e.code) {
      case "ArrowUp":
      case "keyW": {
        directionRef.current = "up";
        break;
      }
      case "ArrowDown":
      case "keyS": {
        directionRef.current = "down";
        break;
      }
      case "ArrowRight":
      case "keyD": {
        directionRef.current = "right";
        break;
      }
      case "ArrowLeft":
      case "keyA": {
        directionRef.current = "left";
        break;
      }
    }
  }, []);

  React.useEffect(() => {
    window.addEventListener("keydown", handlekeyEvents);
    () => {
      window.removeEventListener("keydown", handlekeyEvents);
    };
  }, [handlekeyEvents]);

  return directionRef;
};
