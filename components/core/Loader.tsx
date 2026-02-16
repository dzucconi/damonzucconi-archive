import { color } from "@auspices/eos/client";
import { useRouter } from "next/router";
import { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";

export const Loader: FC = () => {
  const router = useRouter();
  const [progress, setProgress] = useState<number | null>(null);

  const progressRef = useRef<number | null>(null);
  const inFlightCount = useRef(0);
  const shownAt = useRef<number | null>(null);
  const startTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trickleTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const START_DELAY = 120;
  const MIN_VISIBLE = 240;
  const TRICKLE_INTERVAL = 180;

  const clearStartTimer = () => {
    if (!startTimer.current) return;
    clearTimeout(startTimer.current);
    startTimer.current = null;
  };

  const clearTrickleTimer = () => {
    if (!trickleTimer.current) return;
    clearInterval(trickleTimer.current);
    trickleTimer.current = null;
  };

  const clearFinishTimer = () => {
    if (!finishTimer.current) return;
    clearTimeout(finishTimer.current);
    finishTimer.current = null;
  };

  const start = () => {
    if (startTimer.current || progressRef.current !== null) return;

    startTimer.current = setTimeout(() => {
      startTimer.current = null;
      shownAt.current = Date.now();
      setProgress(8);

      trickleTimer.current = setInterval(() => {
        setProgress((value) => {
          if (value === null) return value;
          if (value >= 90) return value;

          const step =
            value < 30 ? 10 : value < 60 ? 6 : value < 80 ? 3 : 1.5;

          return Math.min(90, value + step);
        });
      }, TRICKLE_INTERVAL);
    }, START_DELAY);
  };

  const finish = () => {
    clearStartTimer();
    clearTrickleTimer();
    clearFinishTimer();

    if (progressRef.current === null) return;

    const visibleFor = shownAt.current ? Date.now() - shownAt.current : 0;
    const remainingVisible = Math.max(0, MIN_VISIBLE - visibleFor);

    finishTimer.current = setTimeout(() => {
      setProgress(100);

      finishTimer.current = setTimeout(() => {
        shownAt.current = null;
        setProgress(null);
      }, 180);
    }, remainingVisible);
  };

  useEffect(() => {
    const handleRouteChangeStart = () => {
      inFlightCount.current += 1;
      start();
    };

    const handleRouteDone = () => {
      inFlightCount.current = Math.max(0, inFlightCount.current - 1);
      if (inFlightCount.current !== 0) return;
      finish();
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteDone);
    router.events.on("routeChangeError", handleRouteDone);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteDone);
      router.events.off("routeChangeError", handleRouteDone);
      clearStartTimer();
      clearTrickleTimer();
      clearFinishTimer();
    };
  }, [router.events]);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  return <ProgressBar $progress={progress ?? 0} $visible={progress !== null} />;
};

const TRANSITION_DURATION = 220;

export const ProgressBar = styled.div<{
  $progress: number;
  $visible: boolean;
}>`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 3px;
  transform: ${({ $progress }) =>
    `scaleX(${Math.max(0, Math.min(100, $progress)) / 100})`};
  transform-origin: left center;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition:
    transform ${TRANSITION_DURATION}ms ease-out,
    opacity ${TRANSITION_DURATION / 2}ms ease-in;
  will-change: transform, opacity;
  pointer-events: none;
  z-index: 100;
  background-color: ${color("primary")};
`;
