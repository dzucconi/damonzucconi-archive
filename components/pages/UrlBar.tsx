import { Box, CELL, themeGet } from "@auspices/eos";
import styled from "styled-components";

export const UrlBar = styled(Box).attrs({
  ...CELL,
  borderWidth: 0,
  justifyContent: "center",
  borderRadius: 8,
  textAlign: "center",
  color: "primary",
  bg: "hint",
  truncate: true,
})`
  transition: background-color 250ms;

  &:hover {
    background-color: ${themeGet("colors.tertiary")};
  }
`;

UrlBar.defaultProps = {
  display: "block",
};
