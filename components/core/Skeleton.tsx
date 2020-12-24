import { themeGet } from "@styled-system/theme-get";
import React from "react";
import styled, { css, keyframes } from "styled-components";
import { border, BorderProps } from "styled-system";
import { splitProps } from "../../lib/splitProps";
import { Box, BoxProps } from "@auspices/eos";

const pulse = (colorStart: string, colorEnd: string) => keyframes`
  from {
    background-color: ${colorStart};
  }
  to {
    background-color: ${colorEnd};
  }
`;

interface DoneProps {
  done?: boolean;
}

const Skeleton = styled(Box)<DoneProps>`
  ${({ done }) =>
    done
      ? css`
          background-color: ${themeGet("colors.hint")};
        `
      : css`
          animation: ${(props) =>
              pulse(
                themeGet("colors.hint")(props),
                themeGet("colors.tertiary")(props)
              )}
            750ms ease-in-out infinite alternate;
        `}
`;

export type SkeletonBoxProps = BoxProps & DoneProps;

export const SkeletonBox: React.FC<SkeletonBoxProps> = ({ done, ...rest }) => {
  return <Skeleton aria-busy={!done} done={done} borderRadius={2} {...rest} />;
};

const splitBorderProps = splitProps<BorderProps>(border);

export type SkeletonTextProps = BoxProps & {
  done?: boolean;
};

const SkeletonTextOverlay = styled(SkeletonBox)`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 85%;
  transform: translateY(-50%);
`;

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  children,
  done,
  ...rest
}) => {
  const [borderProps, notBorderProps] = splitBorderProps(rest);

  return (
    <Box aria-busy={!done} {...notBorderProps}>
      <Box
        as="span"
        display="inline-flex"
        position="relative"
        aria-hidden="true"
      >
        <Box color="transparent">{children}</Box>

        <SkeletonTextOverlay done={done} {...borderProps} />
      </Box>
    </Box>
  );
};
