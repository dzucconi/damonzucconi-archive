import { HTML, HTMLProps } from "@auspices/eos";
import { FC } from "react";
import styled from "styled-components";

type EmbedProps = HTMLProps;

export const Embed: FC<EmbedProps> = (props) => {
  return <Container {...props} />;
};

const Container = styled(HTML)`
  > iframe {
    max-width: 100%;
    vertical-align: bottom;
  }
`;
