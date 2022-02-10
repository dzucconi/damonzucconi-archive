import { useState, useRef, useCallback } from "react";
import { isTouch } from "../../lib/isTouch";

export const useHover = () => {
  const defaultMode = isTouch() ? "Active" : "Resting";

  const [mode, setMode] = useState<"Resting" | "Active" | "Open">(defaultMode);

  const timer = useRef<ReturnType<typeof setTimeout>>();

  const handleMouseEnter = useCallback(() => {
    if (mode === "Open") return;
    timer.current && clearTimeout(timer.current);
    setMode("Active");
  }, [mode]);

  const handleMouseLeave = useCallback(() => {
    if (mode === "Open") return;
    timer.current = setTimeout(() => setMode(defaultMode), 100);
  }, [mode]);

  const handleOpen = useCallback(() => {
    setMode("Open");
  }, []);

  const handleClose = useCallback(() => {
    setMode(defaultMode);
  }, []);

  return {
    mode,
    handleOpen,
    handleClose,
    handleMouseEnter,
    handleMouseLeave,
  };
};
