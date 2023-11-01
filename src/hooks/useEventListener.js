import { useEffect, useRef } from "react";

export const useEventListener = (
  eventName,
  handler,
  element = window,
  options = {
    once: false,
  }
) => {
  const savedEventHandler = useRef();
  const { once } = options;

  useEffect(() => {
    savedEventHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener = (event) => savedEventHandler.current(event);

    const opt = { once };
    element.addEventListener(eventName, listener, opt);

    return () => {
      element.removeEventListener(eventName, listener);
    };
  }, [eventName, element, once]);
};
