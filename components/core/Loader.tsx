import { color } from "@auspices/eos/client";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

export const Loader: FC = () => {
  const router = useRouter();
  const [mode, setMode] = useState<"Start" | "Complete">("Complete");

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setMode("Start");
    };

    const handleRouteChangeComplete = () => {
      setTimeout(() => {
        setMode("Complete");
      }, 0);
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, []);

  return (
    <ProgressBar
      key={router.pathname}
      style={
        mode === "Complete" ? { transform: "translateX(100%)", opacity: 0 } : {}
      }
    />
  );
};

const trickling = keyframes`
  100% {
    transform: translateX(99%);
  }
  `;

const TRANSITION_DURATION = 250;

export const ProgressBar = styled.div`
  position: fixed;
  top: 0;
  left: -100%;
  width: 100%;
  height: 3px;
  animation: ${trickling} 60s cubic-bezier(0, 1, 1, 1);
  animation-fill-mode: forwards;
  transition: transform 100ms, opacity 1s;
  transition: transform ${TRANSITION_DURATION}ms ease-out,
    opacity ${TRANSITION_DURATION / 2}ms ${TRANSITION_DURATION / 2}ms ease-in;
  transform: translate3d(0, 0, 0);
  z-index: 100;
  background-color: ${color("primary")};
`;
