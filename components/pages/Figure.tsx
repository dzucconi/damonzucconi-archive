import { gql } from "@apollo/client";
import {
  Box,
  BoxProps,
  Clickable,
  Dropdown,
  Ellipsis,
  PaneOption,
  ResponsiveImage,
} from "@auspices/eos";
import { FC } from "react";
import styled from "styled-components";
import { Figure_ImageFragment } from "../../generated/graphql";
import { useZoom } from "../core/useZoom";

gql`
  fragment Figure_image on Image {
    id
    width
    height
    url
    title
    description
    placeholder: resized(width: 50, height: 50, blur: 10) {
      urls {
        src: _1x
      }
    }
    display: resized(width: 1200, height: 1200) {
      width
      height
      srcs: urls {
        _1x
        _2x
        _3x
      }
    }
  }
`;

type FigureProps = BoxProps & {
  image: Figure_ImageFragment;
};

export const Figure: FC<FigureProps> = ({ image, ...rest }) => {
  const { zoomComponent, openZoom } = useZoom({ src: image.url });

  return (
    <>
      {zoomComponent}

      <Box {...rest}>
        <Container onClick={openZoom}>
          <ResponsiveImage
            indicator
            placeholder={image.placeholder.urls.src}
            srcs={[
              image.display.srcs._1x,
              image.display.srcs._2x,
              image.display.srcs._3x,
            ]}
            aspectWidth={image.display.width}
            aspectHeight={image.display.height}
            maxWidth={image.display.width}
            maxHeight={image.display.height}
            alt={image.title ?? image.description ?? ""}
          >
            <Dropdown
              label={
                <Clickable bg="background" p={3}>
                  <Ellipsis />
                </Clickable>
              }
              position="absolute"
              zIndex={1}
              top={5}
              right={5}
            >
              <PaneOption as="a" href={image.url} target="_blank">
                Download image @{image.width}×{image.height}
              </PaneOption>
            </Dropdown>
          </ResponsiveImage>
        </Container>
      </Box>
    </>
  );
};

const Container = styled(Clickable)`
  width: 100%;
  cursor: zoom-in;

  button {
    opacity: 0;
    transition: 100ms opacity;
  }

  &:hover {
    button {
      opacity: 1;
    }
  }
`;
