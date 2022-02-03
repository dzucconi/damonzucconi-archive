import { gql } from "@apollo/client";
import { Stack, StackProps, Cell } from "@auspices/eos";
import React from "react";
import styled from "styled-components";
import { TombstoneArtworkFragment } from "../../generated/graphql";
import { DefinitionList } from "../core/DefinitionList";

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
    <DefinitionList
      definitions={[
        { term: "Title", definition: artwork.title },
        { term: "Material", definition: artwork.material },
        { term: "Duration", definition: artwork.duration },
        {
          term: "Dimensions",
          definition: artwork.dimensions
            ? [
                {
                  term: "in",
                  definition: artwork.dimensions?.inches.to_s?.replace(
                    "in",
                    ""
                  ),
                },
                {
                  term: "cm",
                  definition: artwork.dimensions?.centimeters.to_s?.replace(
                    "cm",
                    ""
                  ),
                },
              ]
            : null,
        },
        { term: "Year", definition: artwork.year },
        { term: "Notes", definition: artwork.collector_byline },
      ]}
      {...rest}
    />
  );
};
