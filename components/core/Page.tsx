import styled from "styled-components";
import { Box } from "@auspices/eos/client";

export const Page = styled(Box).attrs({
  p: [4, 6],
})`
  box-sizing: content-box;

  > * {
    box-sizing: border-box;
  }
`;

export const Bleed = styled(Box)`
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  max-width: 100vw;
  width: 100vw;
`;
