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
import { useHover } from "./useHover";
import { ContextMenu } from "../core/ContextMenu";
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
  const { zoomComponent, openZoom: handleClick } = useZoom({ src: image.url });
  const { mode, handleMouseEnter, handleMouseLeave, handleOpen, handleClose } =
    useHover();

  return (
    <>
      {zoomComponent}

      <Box
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
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
          <Clickable
            onClick={handleClick}
            position="absolute"
            top={0}
            left={0}
            zIndex={1}
            width="100%"
            height="100%"
            cursor="zoom-in"
          />

          {mode !== "Resting" && (
            <ContextMenu
              position="absolute"
              top={5}
              right={5}
              onOpen={handleOpen}
              onClose={handleClose}
            >
              <PaneOption as="a" href={image.url} target="_blank">
                Download image @{image.width}×{image.height}
              </PaneOption>
            </ContextMenu>
          )}
        </ResponsiveImage>
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
