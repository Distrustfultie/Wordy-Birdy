import { useEffect, useState } from "react";

/**
 * Keeps an element mounted long enough to animate out.
 * `mounted`: render the element at all. `visible`: apply the "shown" classes.
 * On open it mounts first, then flips `visible` on the next frames so CSS
 * transitions run; on close it flips `visible` off and unmounts after `duration`.
 */
const useTransitionState = (open, duration = 150) => {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      let inner;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }
    setVisible(false);
    const timer = setTimeout(() => setMounted(false), duration);
    return () => clearTimeout(timer);
  }, [open, duration]);

  return { mounted, visible };
};

export default useTransitionState;
