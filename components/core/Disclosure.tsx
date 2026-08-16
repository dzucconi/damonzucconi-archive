import { Box, BoxProps, Caret, Stack, boxMixin } from "@auspices/eos/client";
import { DetailsHTMLAttributes, FC, ReactNode } from "react";
import styled from "styled-components";

type DisclosureProps = BoxProps &
  Omit<DetailsHTMLAttributes<HTMLDetailsElement>, "color" | "title"> & {
    label: ReactNode;
  };

export const Disclosure: FC<DisclosureProps> = ({
  children,
  label,
  ...rest
}) => {
  return (
    <Root {...rest}>
      <Box as="summary" fontSize={0} display="flex" alignItems="center">
        <Indicator />

        <Box ml={3}>{label}</Box>
      </Box>

      <Box mt={1}>{children}</Box>
    </Root>
  );
};

const Root = styled.details<BoxProps>`
  ${boxMixin}

  & > summary {
    cursor: pointer;
    list-style: none;
    user-select: none;
  }

  & > summary::-webkit-details-marker {
    display: none;
  }
`;

const Indicator = styled(Caret).attrs({
  direction: "right",
  size: 2,
})`
  transition: transform 250ms ease;

  ${Root}[open] & {
    transform: rotate(90deg);
  }
`;
