import { useEffect, useState, useRef } from "react";
import { Box, Button } from "@auspices/eos/client";

export const BackToTop = () => {
  const [mode, setMode] = useState<"Visible" | "Hidden">("Hidden");

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.style.position = "absolute";
    sentinel.style.top = "300px";
    sentinel.style.height = "1px";
    sentinel.style.width = "100%";
    sentinel.style.pointerEvents = "none";
    document.body.appendChild(sentinel);
    sentinelRef.current = sentinel;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        setMode(entries[0].isIntersecting ? "Hidden" : "Visible");
      },
      { threshold: 0 }
    );

    observerRef.current.observe(sentinel);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (sentinelRef.current && sentinelRef.current.parentNode) {
        sentinelRef.current.parentNode.removeChild(sentinelRef.current);
      }
    };
  }, []);

  return (
    <>
      <Box
        position="fixed"
        bottom={5}
        right={5}
        zIndex={100}
        style={{
          transition: "opacity 250ms, transform 250ms",
          ...(mode === "Visible"
            ? { opacity: 1, transform: "translateY(0)" }
            : { opacity: 0, transform: "translateY(5px)" }),
        }}
      >
        <Button variant="small" aria-label="Top" onClick={scrollToTop}>
          ↑
        </Button>
      </Box>
    </>
  );
};
