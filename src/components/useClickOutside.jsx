// src/hooks/useClickOutside.js
import { useEffect } from "react";

/**
 * Fires `handler` when a click occurs outside of `ref`.
 * @param {React.RefObject} ref
 * @param {Function} handler
 */
export function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler(e);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
