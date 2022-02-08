import { useState, useRef, useCallback } from "react";

export const useHover = () => {
  const [mode, setMode] = useState<"Resting" | "Active" | "Open">("Resting");

  const timer = useRef<ReturnType<typeof setTimeout>>();

  const handleMouseEnter = useCallback(() => {
    if (mode === "Open") return;
    timer.current && clearTimeout(timer.current);
    setMode("Active");
  }, [mode]);

  const handleMouseLeave = useCallback(() => {
    if (mode === "Open") return;
    timer.current = setTimeout(() => setMode("Resting"), 100);
  }, [mode]);

  const handleOpen = useCallback(() => {
    setMode("Open");
  }, []);

  const handleClose = useCallback(() => {
    setMode("Resting");
  }, []);

  return {
    mode,
    handleOpen,
    handleClose,
    handleMouseEnter,
    handleMouseLeave,
  };
};
