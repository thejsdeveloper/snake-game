import React from "react";

export const useLocalStorage = (key, defaultValue) => {
  const [storedValued, setStoredValue] = React.useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return defaultValue;
    }
  });

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(storedValued));
  }, [key, storedValued]);

  return [storedValued, setStoredValue];
};
