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
  const viewerElRef = useRef<HTMLDivElement | null>(null);
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
    if (!viewerElRef.current) return;

    setState({
      loaded: false,
      min: 0,
      max: 1,
      value: 0,
    });

    let destroyed = false;

    const viewer = OpenSeadragon({
      animationTime: 1.5,
      blendTime: 0.0,
      clickDistThreshold: 5,
      clickTimeThreshold: 300,
      constrainDuringPan: false,
      debugMode: false,
      element: viewerElRef.current,
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

    const handleOpen = () => {
      if (destroyed || !viewer.viewport) return;
      setState({
        loaded: true,
        min: viewer.viewport.getMinZoom(),
        max: viewer.viewport.getMaxZoom(),
        value: viewer.viewport.getZoom(),
      });
    };

    const handleZoom = () => {
      if (destroyed || !viewer.viewport) return;
      setState((prevState) => ({
        ...prevState,
        min: viewer.viewport.getMinZoom(),
        max: viewer.viewport.getMaxZoom(),
        value: viewer.viewport.getZoom(),
      }));
    };

    const handleOpenFailed = () => {
      if (destroyed) return;
      setState((prevState) => ({ ...prevState, loaded: true }));
    };

    viewer.addHandler("open", handleOpen);
    viewer.addHandler("zoom", handleZoom);
    viewer.addHandler("open-failed", handleOpenFailed);

    viewerRef.current = viewer;

    return () => {
      destroyed = true;
      viewer.removeHandler("open", handleOpen);
      viewer.removeHandler("zoom", handleZoom);
      viewer.removeHandler("open-failed", handleOpenFailed);
      viewer.destroy();

      if (viewerRef.current === viewer) {
        viewerRef.current = null;
      }
    };
  }, [src]);

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
        width="100vw"
        height="100vh"
        position="relative"
        bg="primary"
      >
        <div
          ref={viewerElRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />

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

  &:focus {
    outline: none;
    background-color: ${color("primary")};
  }
`;
