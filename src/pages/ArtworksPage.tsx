import React from "react";
import gql from "graphql-tag";
import { State, useArtworksPageQuery } from "../generated/graphql";
import { Stack, Pill, Button } from "@auspices/eos";
import { Link } from "react-router-dom";

export const ARTWORKS_PAGE_QUERY = gql`
  query ArtworksPage($state: [State]) {
    artworks(state: $state) {
      id
      slug
      title
      state
      material
      year
    }
  }
`;

export const ArtworksPage = () => {
  const [{ fetching, error, data }] = useArtworksPageQuery({
    variables: {
      state: [State.Published, State.Archived, State.Selected],
    },
  });

  if (error) return <Pill>{error.message}</Pill>;
  if (fetching || !data) return <Pill>Loading...</Pill>;

  const { artworks } = data;

  const groupedByYear = artworks.reduce(
    (memo, artwork) => ({
      ...memo,
      [artwork.year]: [...(memo[artwork.year] ?? []), artwork],
    }),
    {} as Record<string, typeof artworks[number][]>
  );

  const years = Object.keys(groupedByYear).sort().reverse();

  return (
    <Stack>
      {years.map((year) => {
        return (
          <Stack key={year}>
            <Pill justifyContent="center">
              <u>{year}</u>
            </Pill>

            {groupedByYear[year].map((artwork) => (
              <Button
                key={artwork.id}
                as={Link}
                to={`/artworks/${artwork.slug}`}
                disabled={artwork.state === "archived"}
              >
                {artwork.title}
              </Button>
            ))}
          </Stack>
        );
      })}
    </Stack>
  );
};
