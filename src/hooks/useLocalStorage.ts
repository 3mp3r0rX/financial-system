import { useEffect, useState } from "react";

export default function useLocalStorage(key: string, defaultValue: any) {
  const isClient = typeof window !== 'undefined';

  const [value, setValue] = useState(() => {
    if (isClient) {
      const jsonValue = localStorage.getItem(key);
      if (jsonValue != null) return JSON.parse(jsonValue);
    }

    if (typeof defaultValue === "function") {
      return defaultValue();
    } else {
      return defaultValue;
    }
  });

  useEffect(() => {
    if (isClient) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value, isClient]);

  return [value, setValue];
}