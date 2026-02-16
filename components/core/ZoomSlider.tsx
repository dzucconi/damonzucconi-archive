import {
  Box,
  ClickableProps,
  Clickable,
  BoxProps,
  Plus,
  color,
} from "@auspices/eos/client";
import { themeGet } from "@styled-system/theme-get";
import * as React from "react";
import styled, { css } from "styled-components";

interface ZoomSliderProps extends BoxProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onZoomInClicked?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onZoomOutClicked?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ZoomSlider: React.FC<ZoomSliderProps> = ({
  min,
  max,
  step,
  onChange,
  value,
  onZoomInClicked,
  onZoomOutClicked,
  ...rest
}) => (
  <Container
    display="flex"
    px={6}
    py={4}
    justifyContent="center"
    alignItems="center"
    {...rest}
  >
    <ZoomOutButton onClick={onZoomOutClicked} />

    <Track mx={3}>
      <SliderInput
        type="range"
        min={min.toString()}
        max={max.toString()}
        step={step.toString()}
        onChange={onChange}
        value={value}
      />
    </Track>

    <ZoomInButton onClick={onZoomInClicked} />
  </Container>
);

const Container = styled(Box)`
  transition: background-color 250ms;
  background-color: ${color("primary", 0.5)};

  &:hover {
    background-color: ${color("primary")};
  }
`;

const railStyles = css`
  width: 100%;
  height: ${themeGet("space.3")};
`;

const knobStyles = css`
  user-select: none;
  cursor: pointer;
  width: ${themeGet("space.3")};
  height: ${themeGet("space.3")};
  background-color: ${themeGet("colors.background")};
  border-radius: 50%;
`;

const Track = styled(Box)`
  display: flex;
  align-items: center;
  position: relative;

  &:before {
    content: "";
    display: block;
    position: absolute;
    height: 2px;
    left: 0;
    right: 0;
    top: 50%;
    margin-top: -1px;
    background-color: ${themeGet("colors.background")};
  }
`;

const SliderInput = styled.input`
  appearance: none;
  background: transparent;
  position: relative;

  &::-webkit-slider-runnable-track {
    ${railStyles}
  }

  &::-moz-range-track {
    ${railStyles}
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    ${knobStyles}
  }

  &::-moz-range-thumb {
    ${knobStyles}
  }
`;

const ZoomOutButton: React.FC<ClickableProps> = (props) => (
  <Clickable cursor="pointer" {...props}>
    <Plus size={5} axis="horizontal" color="background" />
  </Clickable>
);

const ZoomInButton: React.FC<ClickableProps> = (props) => (
  <Clickable cursor="pointer" {...props}>
    <Plus size={5} color="background" />
  </Clickable>
);
