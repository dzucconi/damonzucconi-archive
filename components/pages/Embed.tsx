import { color, HTML, HTMLProps } from "@auspices/eos";
import { FC } from "react";
import styled from "styled-components";

type EmbedProps = HTMLProps;

export const Embed: FC<EmbedProps> = (props) => {
  return <Container {...props} />;
};

const Container = styled(HTML)`
  background-color: ${color("hint")};
  width: 100%;

  iframe,
  img {
    display: block;
    max-width: 100%;
    vertical-align: bottom;
    margin: 0 auto;
  }
`;
