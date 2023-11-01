import React from "react";

export const useGameControl = (init) => {
  const directionRef = React.useRef(init);
  const handleKeyEvents = React.useCallback((e) => {
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
    window.addEventListener("keydown", handleKeyEvents);
    () => {
      window.removeEventListener("keydown", handleKeyEvents);
    };
  }, [handleKeyEvents]);

  return directionRef;
};
