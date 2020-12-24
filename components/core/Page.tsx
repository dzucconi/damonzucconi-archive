import styled from "styled-components";
import { Box } from "@auspices/eos";

export const Page = styled(Box)`
  box-sizing: content-box;
  max-width: 1200px;

  > * {
    box-sizing: border-box;
  }
`;

Page.defaultProps = {
  py: 6,
  px: 3,
  mx: "auto",
};

export const Bleed = styled(Box)`
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  max-width: 100vw;
  width: 100vw;
`;
