import React from "react";
import gql from "graphql-tag";
import { useParams } from "react-router-dom";
import {
  useArtworkPageQuery,
  ArtworkPageTombstoneFragmentDoc,
} from "../../generated/graphql";
import { Pill, Stack } from "@auspices/eos";
import { ArtworkPageTombstone } from "./components/ArtworkPageTombstone";

export const ARTWORK_PAGE_QUERY = gql`
  query ArtworkPage($id: ID!) {
    artwork(id: $id) {
      id
      title
      intent
      images(state: PUBLISHED) {
        resized(width: 1125, height: 1125) {
          width
          height
          urls {
            _1x
            _2x
          }
        }
      }
      ...ArtworkPageTombstone
    }
  }
  ${ArtworkPageTombstoneFragmentDoc}
`;

export const ArtworkPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [{ fetching, error, data }] = useArtworkPageQuery({
    variables: { id },
  });

  if (error) return <Pill>{error.message}</Pill>;
  if (fetching || !data) return <Pill>Loading...</Pill>;

  const { artwork } = data;

  return (
    <Stack>
      {artwork.images.length > 0 && (
        <Pill
          px={0}
          py={0}
          display="flex"
          flexDirection="column"
          alignItems="start"
        >
          {artwork.images.map(({ resized: src }) => {
            return (
              <img
                src={src.urls._1x}
                srcSet={`${src.urls._1x} 1x, ${src.urls._2x} 2x`}
                width={src.width}
                height={src.height}
                alt={artwork.title}
              />
            );
          })}
        </Pill>
      )}

      <ArtworkPageTombstone artwork={artwork} />
    </Stack>
  );
};
