import { color, HTML, HTMLProps } from "@auspices/eos/client";
import { FC } from "react";
import styled from "styled-components";

type EmbedProps = HTMLProps;

export const Embed: FC<EmbedProps> = (props) => {
  return <Container {...props} />;
};

const Container = styled(HTML)`
  width: 100%;

  iframe,
  img,
  audio,
  video {
    display: block;
    max-width: 100%;
    vertical-align: bottom;
    margin: 0 auto;
  }
`;
