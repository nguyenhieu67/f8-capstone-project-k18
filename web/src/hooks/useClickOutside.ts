import { useState, useEffect, useRef } from "react";

export default function useClickOutside<T extends HTMLElement = HTMLElement>(
  initialState = false,
) {
  const [isOpen, setIsOpen] = useState(initialState);
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!isOpen) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [isOpen]);

  return { isOpen, setIsOpen, ref };
}
