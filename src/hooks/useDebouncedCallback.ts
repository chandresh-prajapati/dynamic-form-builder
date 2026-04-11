import { useCallback, useRef } from "react";

export function useDebouncedCallback<T extends (...a: unknown[]) => void>(fn: T, ms: number) {
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  return useCallback(
    (...args: Parameters<T>) => {
      if (t.current) clearTimeout(t.current);
      t.current = setTimeout(() => {
        fn(...args);
        t.current = null;
      }, ms);
    },
    [fn, ms]
  );
}
