import { File, EmptyFrame, ResponsiveImage, Box } from "@auspices/eos";
import Link from "next/link";
import { FC } from "react";
import styled from "styled-components";
import { gql } from "urql";
import { ThumbnailArtwork_ArtworkFragment } from "../../generated/graphql";

export const THUMBNAIL_ARTWORK_FRAGMENT = gql`
  fragment ThumbnailArtwork_artwork on Artwork {
    id
    slug
    title
    material
    year
    price {
      amount
      was
    }
    images(limit: 1, state: PUBLISHED) {
      placeholder: resized(width: 50, height: 50, blur: 10) {
        urls {
          src: _1x
        }
      }
      resized(width: 200, height: 200) {
        width
        height
        urls {
          _1x
          _2x
          _3x
        }
      }
    }
  }
`;

type ThumbnailArtworkProps = {
  artwork: ThumbnailArtwork_ArtworkFragment;
  displayPrice?: boolean;
};

export const ThumbnailArtwork: FC<ThumbnailArtworkProps> = ({
  artwork,
  displayPrice = false,
}) => {
  const [image] = artwork.images;

  return (
    <Link
      key={artwork.id}
      href={`/artworks/${artwork.slug}`}
      aria-label={`${artwork.title}; ${artwork.material} (${artwork.year})`}
      passHref
      legacyBehavior
    >
      <File
        name={artwork.title}
        meta={`${artwork.year}`}
        // @ts-ignore
        as="a"
        position="relative"
      >
        {displayPrice && artwork.price && (
          <Box
            position="absolute"
            top={20}
            left={20}
            zIndex={2}
            fontSize={0}
            color="primary"
            bg="accent"
            px={2}
            py={1}
            borderRadius={2}
          >
            {artwork.price.was && (
              <Strikethrough>{artwork.price.was}</Strikethrough>
            )}{" "}
            {artwork.price.amount}
          </Box>
        )}

        {image ? (
          <ResponsiveImage
            placeholder={image.placeholder.urls.src}
            srcs={[
              image.resized.urls._1x,
              image.resized.urls._2x,
              image.resized.urls._3x,
            ]}
            aspectWidth={image.resized.width}
            aspectHeight={image.resized.height}
            maxWidth={image.resized.width}
            maxHeight={image.resized.height}
            alt={artwork.title}
            loading="lazy"
          />
        ) : (
          <EmptyFrame
            width="100%"
            height="100%"
            color="hint"
            border="1px solid"
            borderColor="hint"
          />
        )}
      </File>
    </Link>
  );
};

const Strikethrough = styled.span`
  text-decoration: line-through;
`;
