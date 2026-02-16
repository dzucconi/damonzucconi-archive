import { gql } from "urql";
import {
  Box,
  BoxProps,
  Clickable,
  PaneOption,
  ResponsiveImage,
} from "@auspices/eos/client";
import { FC } from "react";
import { Figure_ImageFragment } from "../../generated/graphql";
import { useHover } from "./useHover";
import { ContextMenu } from "../core/ContextMenu";
import { useZoom } from "../core/useZoom";

export const FIGURE_IMAGE_FRAGMENT = gql`
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
      }
    }
    zoom: resized(width: 4000, height: 4000, quality: 60) {
      srcs: urls {
        _1x
      }
    }
  }
`;

type FigureProps = BoxProps & {
  image: Figure_ImageFragment;
  zoomImages?: string[];
  zoomIndex?: number;
};

export const Figure: FC<FigureProps> = ({
  image,
  zoomImages,
  zoomIndex = 0,
  ...rest
}) => {
  const { zoomComponent, openZoom: handleClick } = useZoom({
    srcs: zoomImages,
    src: image.zoom.srcs._1x,
    initialIndex: zoomIndex,
  });
  const {
    mode,
    handleMouseEnter,
    handleMouseLeave,
    handleOpen,
    handleClose,
    touch,
  } = useHover();

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
          srcs={[image.display.srcs._1x, image.display.srcs._2x]}
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

          {!touch && mode !== "Resting" && (
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
