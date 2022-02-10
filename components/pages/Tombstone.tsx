import { gql } from "urql";
import { StackProps } from "@auspices/eos";
import React from "react";
import { Tombstone_ArtworkFragment } from "../../generated/graphql";
import { DefinitionList } from "../core/DefinitionList";

export const TOMBSTONE_ARTWORK_FRAGMENT = gql`
  fragment Tombstone_artwork on Artwork {
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
  artwork: Tombstone_ArtworkFragment;
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
