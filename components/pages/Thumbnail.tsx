import { gql } from "urql";
import { Box, File, PaneOption, ResponsiveImage } from "@auspices/eos";
import { FC, useCallback, useRef, useState } from "react";
import { Thumbnail_ImageFragment } from "../../generated/graphql";
import { useZoom } from "../core/useZoom";
import { ContextMenu } from "../core/ContextMenu";
import { useHover } from "./useHover";

export const THUMBNAIL_IMAGE_FRAGMENT = gql`
  fragment Thumbnail_image on Image {
    width
    height
    title
    description
    url
    placeholder: resized(width: 50, height: 50, blur: 10) {
      urls {
        src: _1x
      }
    }
    thumb: resized(width: 200, height: 200) {
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

type ThumbnailProps = {
  image: Thumbnail_ImageFragment;
};

export const Thumbnail: FC<ThumbnailProps> = ({ image }) => {
  const { zoomComponent, openZoom: handleClick } = useZoom({ src: image.url });
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
        width="100%"
        position="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {!touch && mode !== "Resting" && (
          <ContextMenu
            position="absolute"
            top={3}
            right={3}
            zIndex={10}
            onOpen={handleOpen}
            onClose={handleClose}
          >
            <PaneOption as="a" href={image.url} target="_blank">
              Download image @{image.width}×{image.height}
            </PaneOption>
          </ContextMenu>
        )}

        <File
          position="static"
          name={image.title!}
          meta={image.description! || `${image.width}×${image.height}`}
          onClick={handleClick}
          cursor="pointer"
        >
          <ResponsiveImage
            placeholder={image.placeholder.urls.src}
            srcs={[
              image.thumb.srcs._1x,
              image.thumb.srcs._2x,
              image.thumb.srcs._3x,
            ]}
            aspectWidth={image.thumb.width}
            aspectHeight={image.thumb.height}
            maxWidth={image.thumb.width}
            maxHeight={image.thumb.height}
            alt={image.title ?? ""}
            loading="lazy"
          />
        </File>
      </Box>
    </>
  );
};
