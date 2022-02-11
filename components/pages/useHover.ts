import { useState, useRef, useCallback, useEffect } from "react";
import { isTouch } from "../../lib/isTouch";

type Mode = "Resting" | "Active" | "Open";

export const useHover = () => {
  const [defaultMode, setDefaultMode] = useState<Mode>("Resting");
  const [mode, setMode] = useState<Mode>(defaultMode);

  useEffect(() => {
    setDefaultMode(isTouch() ? "Active" : "Resting");
  }, []);

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
