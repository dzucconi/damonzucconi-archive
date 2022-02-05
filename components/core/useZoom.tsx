import dynamic from "next/dynamic";
import { useState } from "react";

const Zoom = dynamic(() => import("./Zoom"), {
  ssr: false,
});

export const useZoom = ({ src }: { src: string }) => {
  const [open, setOpen] = useState(false);

  const closeZoom = () => {
    setOpen(false);
  };

  const openZoom = () => {
    setOpen(true);
  };

  const zoomComponent = <>{open && <Zoom onClose={closeZoom} src={src} />}</>;

  return {
    open,
    closeZoom,
    openZoom,
    zoomComponent,
  };
};
