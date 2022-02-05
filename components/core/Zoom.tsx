import { Box, Clickable, color, Modal, Plus, Spinner } from "@auspices/eos";
import { FC, useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import styled from "styled-components";
import { ZoomSlider } from "./ZoomSlider";

const ZOOM_PER_CLICK = 1.4;

type ZoomProps = {
  onClose: () => void;
  src: string;
};

export const Zoom: FC<ZoomProps> = ({ onClose, src }) => {
  const elRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any | null>(null);

  const [state, setState] = useState({
    loaded: false,
    min: 0,
    max: 1,
    value: 0,
  });

  const zoomBy = (amount: number) => {
    if (!viewerRef.current) return;
    const { current: viewer } = viewerRef;
    if (!viewer.viewport) return;
    viewer.viewport.zoomBy(amount);
    viewer.viewport.applyConstraints();
  };

  const handleSliderChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!viewerRef.current) return;
    viewerRef.current.viewport.zoomTo(parseFloat(event.target.value));
  };

  const handleZoomInClicked = () => {
    zoomBy(ZOOM_PER_CLICK);
  };

  const handleZoomOutClicked = () => {
    zoomBy(1 / ZOOM_PER_CLICK);
  };

  useEffect(() => {
    if (!elRef.current) return;

    const viewer = OpenSeadragon({
      animationTime: 1.5,
      blendTime: 0.0,
      clickDistThreshold: 5,
      clickTimeThreshold: 300,
      constrainDuringPan: false,
      debugMode: false,
      element: elRef.current,
      gestureSettingsTouch: {
        clickToZoom: true,
        flickEnabled: true,
        flickMinSpeed: 20,
        flickMomentum: 0.4,
        pinchToZoom: true,
        scrollToZoom: false,
      },
      immediateRender: false,
      maxZoomPixelRatio: 1.0,
      minZoomImageRatio: 0.9,
      showNavigationControl: false,
      springStiffness: 15.0,
      tileSources: { type: "image", url: src },
      useCanvas: true,
      visibilityRatio: 1,
      zoomPerClick: ZOOM_PER_CLICK,
      zoomPerScroll: 1.4,
    });

    viewer.addHandler("tile-loaded", () => {
      setState((prevState) => ({ ...prevState, loaded: true }));
    });

    viewer.addHandler("zoom", () => {
      setState((prevState) => ({
        ...prevState,
        min: viewer.viewport.getMinZoom(),
        max: viewer.viewport.getMaxZoom(),
        value: viewer.viewport.getZoom(),
      }));
    });

    viewerRef.current = viewer;

    return () => {
      viewerRef.current.destroy();
      viewerRef.current = null;
    };
  }, []);

  return (
    <Modal onClose={onClose} zIndex={100}>
      <Close
        position="absolute"
        top={20}
        right={20}
        zIndex={1}
        p={4}
        onClick={onClose}
      >
        <Plus
          size={6}
          color="background"
          style={{ transform: "rotate(45deg)" }}
        />
      </Close>

      <Box
        ref={elRef}
        width="100vw"
        height="100vh"
        position="relative"
        bg="primary"
      >
        {!state.loaded && (
          <Spinner
            position="absolute"
            top="50%"
            left="50%"
            color="background"
            // TODO: Fix typing
            // @ts-ignore
            style={{ transform: "translate(-50%, -50%)" }}
          />
        )}

        <Box
          display="flex"
          position="absolute"
          bottom={20}
          left="50%"
          style={{ transform: "translateX(-50%)" }}
          zIndex={1}
        >
          <ZoomSlider
            onChange={handleSliderChanged}
            onZoomInClicked={handleZoomInClicked}
            onZoomOutClicked={handleZoomOutClicked}
            min={state.min}
            max={state.max}
            value={state.value}
            step={0.001}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default Zoom;

const Close = styled(Clickable)`
  cursor: pointer;
  transition: background-color 250ms;
  background-color: ${color("primary", 0.5)};

  &:hover {
    background-color: ${color("primary")};
  }
`;
