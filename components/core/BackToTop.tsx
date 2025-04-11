import { useEffect, useState } from "react";
import { Box, Button } from "@auspices/eos";

export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
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
          ...(isVisible
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
