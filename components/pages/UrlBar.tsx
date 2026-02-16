import { Box, Cell, color, themeGet } from "@auspices/eos/client";
import { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { wait } from "../../lib/wait";

type UrlBarProps = {
  children: string;
  href: string;
  target?: string;
};

export const UrlBar: FC<UrlBarProps> = ({ children, href, target }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [offset, setOffset] = useState(0);
  const [activeOffset, setActiveOffset] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (!ref.current) return;
      setOffset(ref.current.scrollWidth - ref.current.offsetWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setActiveOffset(offset);
  }, [offset]);

  return (
    <Cell
      as="a"
      href={href}
      target={target}
      variant="default"
      borderWidth={0}
      justifyContent="center"
      borderRadius={8}
      textAlign="center"
      color="primary"
      bg="hint"
      display="block"
      position="relative"
      overflow="hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Hover $visible={hovered} />
      <Fade $visible={!hovered} />

      <Url
        ref={ref as any}
        style={{
          transform: `translateX(-${activeOffset}px)`,
          transition: `transform ${offset * 33}ms linear`,
        }}
        onTransitionEnd={async () => {
          await wait(2000);
          setActiveOffset((prevOffset) => (prevOffset === 0 ? offset : 0));
        }}
      >
        {children}
      </Url>
    </Cell>
  );
};

const Hover = styled(Box)<{ $visible: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  background-color: ${color("tertiary", 0.5)};
  transition: opacity 250ms;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
`;

const Url = styled(Box)`
  position: relative;
  white-space: nowrap;
  z-index: 2;
`;

const Fade = styled(Box)<{ $visible: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 3;
  transition: opacity 250ms;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};

  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    width: ${themeGet("space.6")};
    border-radius: 8px;
  }

  &:before {
    left: 0;
    background: linear-gradient(to left, ${color("hint", 0)}, ${color("hint")});
  }

  &:after {
    right: 0;
    background: linear-gradient(
      to right,
      ${color("hint", 0)},
      ${color("hint")}
    );
  }
`;
