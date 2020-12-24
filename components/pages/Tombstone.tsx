import { gql } from "@apollo/client";
import { Stack, StackProps, Cell } from "@auspices/eos";
import React from "react";
import { TombstoneArtworkFragment } from "../../generated/graphql";

gql`
  fragment TombstoneArtworkFragment on Artwork {
    title
    material
    duration
    year
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

export type TombstoneProps = StackProps & {
  artwork: TombstoneArtworkFragment;
};

export const Tombstone: React.FC<TombstoneProps> = ({ artwork, ...rest }) => {
  return (
    <Stack width="fit-content" {...rest}>
      <Stack direction="horizontal">
        <Cell>title</Cell>
        <Cell as="h1" flex="1">
          {artwork.title}
        </Cell>
      </Stack>

      {artwork.material && (
        <Stack direction="horizontal">
          <Cell>material</Cell>
          <Cell flex="1">{artwork.material}</Cell>
        </Stack>
      )}

      {artwork.duration && (
        <Stack direction="horizontal">
          <Cell>duration</Cell>
          <Cell flex="1">{artwork.duration}</Cell>
        </Stack>
      )}

      {artwork.dimensions && (
        <Stack direction="horizontal">
          <Cell>dimensions</Cell>
          <Cell flex="1">
            {artwork.dimensions.inches.to_s} (
            {artwork.dimensions.centimeters.to_s})
          </Cell>
        </Stack>
      )}

      <Stack direction="horizontal">
        <Cell>year</Cell>
        <Cell flex="1">{artwork.year}</Cell>
      </Stack>
    </Stack>
  );
};
