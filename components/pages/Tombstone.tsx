import { gql } from "@apollo/client";
import { Stack, StackProps, Cell } from "@auspices/eos";
import React from "react";
import styled from "styled-components";
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
    collector_byline
  }
`;

export type TombstoneProps = StackProps & {
  artwork: TombstoneArtworkFragment;
};

export const Tombstone: React.FC<TombstoneProps> = ({ artwork, ...rest }) => {
  return (
    <Stack width="fit-content" {...rest}>
      <Stack direction="horizontal">
        <TombstoneCell>title</TombstoneCell>
        <TombstoneCell as="h1" flex="1">
          {artwork.title}
        </TombstoneCell>
      </Stack>

      {artwork.material && (
        <Stack direction="horizontal">
          <TombstoneCell>material</TombstoneCell>

          <TombstoneCell flex="1">{artwork.material}</TombstoneCell>
        </Stack>
      )}

      {artwork.duration && (
        <Stack direction="horizontal">
          <TombstoneCell>duration</TombstoneCell>

          <TombstoneCell flex="1">{artwork.duration}</TombstoneCell>
        </Stack>
      )}

      {artwork.dimensions && (
        <Stack direction="horizontal">
          <TombstoneCell>dimensions</TombstoneCell>

          <Stack flex="1">
            <Stack direction="horizontal">
              <TombstoneCell>in</TombstoneCell>
              <TombstoneCell flex="1">
                {artwork.dimensions.inches.to_s?.replace("in", "")}
              </TombstoneCell>
            </Stack>

            <Stack direction="horizontal">
              <TombstoneCell>cm</TombstoneCell>
              <TombstoneCell flex="1">
                {artwork.dimensions.centimeters.to_s?.replace("cm", "")}
              </TombstoneCell>
            </Stack>
          </Stack>
        </Stack>
      )}

      <Stack direction="horizontal">
        <TombstoneCell>year</TombstoneCell>

        <TombstoneCell flex="1">{artwork.year}</TombstoneCell>
      </Stack>

      {artwork.collector_byline && (
        <Stack direction="horizontal">
          <TombstoneCell>notes</TombstoneCell>

          <TombstoneCell flex="1">{artwork.collector_byline}</TombstoneCell>
        </Stack>
      )}
    </Stack>
  );
};

const TombstoneCell = styled(Cell)``;

TombstoneCell.defaultProps = {
  fontSize: 1,
  px: 3,
  py: 2,
};
