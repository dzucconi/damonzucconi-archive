import styled from "styled-components";
import { compose, grid, GridProps as SystemGridProps } from "styled-system";
import { Box, BoxProps } from "@auspices/eos";

export type GridProps = BoxProps & SystemGridProps;

export const Grid = styled(Box)<GridProps>`
  display: grid;
  ${compose(grid)}
`;
