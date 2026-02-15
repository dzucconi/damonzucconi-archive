import dynamic from "next/dynamic";
import { useState } from "react";

const Zoom = dynamic(() => import("./Zoom"), {
  ssr: false,
});

type UseZoomArgs = {
  src?: string;
  srcs?: string[];
  initialIndex?: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const useZoom = ({ src, srcs, initialIndex = 0 }: UseZoomArgs) => {
  const sources = srcs && srcs.length > 0 ? srcs : src ? [src] : [];
  const maxIndex = Math.max(sources.length - 1, 0);
  const clampedInitialIndex = clamp(initialIndex, 0, maxIndex);
  const [open, setOpen] = useState(false);

  const closeZoom = () => {
    setOpen(false);
  };

  const openZoom = () => {
    setOpen(true);
  };

  const zoomComponent = (
    <>
      {open && sources.length > 0 && (
        <Zoom
          onClose={closeZoom}
          srcs={sources}
          initialIndex={clampedInitialIndex}
        />
      )}
    </>
  );

  return {
    open,
    closeZoom,
    openZoom,
    zoomComponent,
  };
};
