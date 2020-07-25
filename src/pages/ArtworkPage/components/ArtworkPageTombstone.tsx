import React from "react";
import gql from "graphql-tag";
import { Pill, Stack, StackProps } from "@auspices/eos";

export const ARTWORK_PAGE_TOMBSTONE_FRAGMENT = gql`
  fragment ArtworkPageTombstone on Artwork {
    title
    year
    material
    duration
    description(format: HTML)
    dimensions {
      inches {
        to_s
      }
      centimeters {
        to_s
      }
    }
  }
`;

type ArtworkPageTombstone = {
  artwork: any;
} & StackProps;

export const ArtworkPageTombstone: React.FC<ArtworkPageTombstone> = ({
  artwork,
  ...rest
}) => {
  return (
    <Stack {...rest}>
      <Pill>{artwork.title}</Pill>
      <Pill>{artwork.year}</Pill>
      {artwork.material && <Pill>{artwork.material}</Pill>}
      {artwork.duration && <Pill>{artwork.duration}</Pill>}
      {artwork.dimensions && (
        <Pill>
          {artwork.dimensions.inches.to_s} (
          {artwork.dimensions.centimeters.to_s})
        </Pill>
      )}
    </Stack>
  );
};
