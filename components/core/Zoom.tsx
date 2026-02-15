import {
  Box,
  Caret,
  Clickable,
  color,
  Modal,
  Plus,
  Spinner,
} from "@auspices/eos";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import styled, { css } from "styled-components";
import { ZoomSlider } from "./ZoomSlider";

const ZOOM_PER_CLICK = 1.4;
const CONTROL_FADE_TIMEOUT = 1200;

type ZoomProps = {
  onClose: () => void;
  src?: string;
  srcs?: string[];
  initialIndex?: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
const wrap = (value: number, max: number) => {
  if (max <= 0) return 0;
  return ((value % max) + max) % max;
};

export const Zoom: FC<ZoomProps> = ({
  onClose,
  src,
  srcs,
  initialIndex = 0,
}) => {
  const sources = useMemo(
    () => (srcs && srcs.length > 0 ? srcs : src ? [src] : []),
    [src, srcs],
  );
  const maxIndex = Math.max(sources.length - 1, 0);
  const hasMultipleImages = sources.length > 1;

  const [index, setIndex] = useState(clamp(initialIndex, 0, maxIndex));
  const viewerElRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any | null>(null);
  const controlHoverRef = useRef(false);
  const hideControlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [hoverCapable, setHoverCapable] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(true);

  const [state, setState] = useState({
    loaded: false,
    min: 0,
    max: 1,
    value: 0,
  });

  const currentSrc = sources[index];
  const showControls = !hoverCapable || controlsVisible;
  const showNavigation = hasMultipleImages && showControls;

  const clearHideControlsTimeout = useCallback(() => {
    if (!hideControlsTimeoutRef.current) return;
    clearTimeout(hideControlsTimeoutRef.current);
    hideControlsTimeoutRef.current = null;
  }, []);

  const activateControls = useCallback(() => {
    if (!hoverCapable) {
      setControlsVisible(true);
      clearHideControlsTimeout();
      return;
    }

    clearHideControlsTimeout();
    setControlsVisible(true);
    hideControlsTimeoutRef.current = setTimeout(() => {
      if (controlHoverRef.current) return;
      setControlsVisible(false);
    }, CONTROL_FADE_TIMEOUT);
  }, [clearHideControlsTimeout, hoverCapable]);

  const deactivateControls = useCallback(() => {
    if (!hoverCapable) return;
    if (controlHoverRef.current) return;
    clearHideControlsTimeout();
    setControlsVisible(false);
  }, [clearHideControlsTimeout, hoverCapable]);

  const handleControlMouseEnter = useCallback(() => {
    controlHoverRef.current = true;
    clearHideControlsTimeout();
    setControlsVisible(true);
  }, [clearHideControlsTimeout]);

  const handleControlMouseLeave = useCallback(() => {
    controlHoverRef.current = false;
    activateControls();
  }, [activateControls]);

  const showPrevious = useCallback(() => {
    setIndex((prevIndex) => wrap(prevIndex - 1, sources.length));
  }, [sources.length]);

  const showNext = useCallback(() => {
    setIndex((prevIndex) => wrap(prevIndex + 1, sources.length));
  }, [sources.length]);

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
    setIndex(clamp(initialIndex, 0, maxIndex));
  }, [initialIndex, maxIndex]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    )
      return;

    const mediaQueryList = window.matchMedia("(hover: hover)");
    const handleHoverCapabilityChanged = () => {
      setHoverCapable(mediaQueryList.matches);
    };

    handleHoverCapabilityChanged();

    if (typeof mediaQueryList.addEventListener === "function") {
      mediaQueryList.addEventListener("change", handleHoverCapabilityChanged);
      return () => {
        mediaQueryList.removeEventListener(
          "change",
          handleHoverCapabilityChanged,
        );
      };
    }

    mediaQueryList.addListener(handleHoverCapabilityChanged);
    return () => {
      mediaQueryList.removeListener(handleHoverCapabilityChanged);
    };
  }, []);

  useEffect(() => {
    if (!hoverCapable) {
      setControlsVisible(true);
      clearHideControlsTimeout();
      return;
    }

    activateControls();
    return clearHideControlsTimeout;
  }, [activateControls, clearHideControlsTimeout, hoverCapable, index]);

  useEffect(() => {
    if (!hasMultipleImages) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        activateControls();
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        activateControls();
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activateControls, hasMultipleImages, showNext, showPrevious]);

  useEffect(() => {
    if (!viewerElRef.current || !currentSrc) return;

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
      tileSources: { type: "image", url: currentSrc },
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
  }, [currentSrc]);

  if (!currentSrc) {
    return null;
  }

  return (
    <Modal onClose={onClose} zIndex={100}>
      <Box
        width="100vw"
        height="100vh"
        position="relative"
        bg="primary"
        onMouseMove={activateControls}
        onMouseEnter={activateControls}
        onMouseLeave={deactivateControls}
        onTouchStart={activateControls}
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

        <Close
          $visible={showControls}
          position="absolute"
          top={20}
          right={20}
          zIndex={1}
          p={4}
          onClick={onClose}
          onMouseEnter={handleControlMouseEnter}
          onMouseLeave={handleControlMouseLeave}
        >
          <Plus
            size={6}
            color="background"
            style={{ transform: "rotate(45deg)" }}
          />
        </Close>

        {hasMultipleImages && (
          <ImageCount
            $visible={showControls}
            position="absolute"
            top={20}
            left={20}
            zIndex={1}
            px={3}
            py={2}
            fontSize={0}
            lineHeight={1}
            color="background"
          >
            {index + 1} / {sources.length}
          </ImageCount>
        )}

        {hasMultipleImages && (
          <>
            <Navigate
              aria-label="Previous image"
              position="absolute"
              top="50%"
              left={20}
              p={4}
              onClick={() => {
                activateControls();
                showPrevious();
              }}
              $visible={showNavigation}
              onMouseEnter={handleControlMouseEnter}
              onMouseLeave={handleControlMouseLeave}
            >
              <Caret direction="left" size={6} />
            </Navigate>

            <Navigate
              aria-label="Next image"
              position="absolute"
              top="50%"
              right={20}
              p={4}
              onClick={() => {
                activateControls();
                showNext();
              }}
              $visible={showNavigation}
              onMouseEnter={handleControlMouseEnter}
              onMouseLeave={handleControlMouseLeave}
            >
              <Caret direction="right" size={6} />
            </Navigate>
          </>
        )}

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

        <SliderControls
          $visible={showControls}
          display="flex"
          position="absolute"
          bottom={20}
          left="50%"
          style={{ transform: "translateX(-50%)" }}
          zIndex={1}
          onMouseEnter={handleControlMouseEnter}
          onMouseLeave={handleControlMouseLeave}
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
        </SliderControls>
      </Box>
    </Modal>
  );
};

export default Zoom;

const sharedControlVisibilityStyles = css<{ $visible: boolean }>`
  transition:
    opacity 250ms,
    background-color 250ms;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  pointer-events: ${(props) => (props.$visible ? "auto" : "none")};
`;

const Close = styled(Clickable)<{ $visible: boolean }>`
  cursor: pointer;
  ${sharedControlVisibilityStyles}
  background-color: ${color("primary", 0.5)};

  &:hover {
    background-color: ${color("primary")};
  }

  &:focus {
    outline: none;
    background-color: ${color("primary")};
  }
`;

const Navigate = styled(Clickable)<{ $visible: boolean }>`
  cursor: pointer;
  z-index: 1;
  transform: translateY(-50%);
  ${sharedControlVisibilityStyles}
  background-color: transparent;
  color: #fff;
  mix-blend-mode: difference;

  &:hover {
    background-color: transparent;
  }
`;

const SliderControls = styled(Box)<{ $visible: boolean }>`
  ${sharedControlVisibilityStyles}
`;

const ImageCount = styled(Box)<{ $visible: boolean }>`
  ${sharedControlVisibilityStyles}
  pointer-events: none;
  background-color: ${color("primary", 0.5)};
`;
