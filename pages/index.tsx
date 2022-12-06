import { gql } from "urql";
import { Grid, Stack } from "@auspices/eos";
import { State, useArtworksIndexQuery } from "../generated/graphql";
import { NavigationLayout } from "../components/layouts/NavigationLayout";
import { Loading } from "../components/core/Loading";
import { Meta } from "../components/core/Meta";
import {
  ThumbnailArtwork,
  THUMBNAIL_ARTWORK_FRAGMENT,
} from "../components/pages/ThumbnailArtwork";
import { buildGetStaticProps, withUrql } from "../lib/urql";

export const ARTWORKS_INDEX_QUERY = gql`
  query ArtworksIndexQuery($state: [State]) {
    artworks(state: $state) {
      id
      ...ThumbnailArtwork_artwork
    }
  }
  ${THUMBNAIL_ARTWORK_FRAGMENT}
`;

const ArtworksIndexPage = () => {
  const [{ fetching, error, data }] = useArtworksIndexQuery({
    variables: { state: [State.Selected] },
  });

  if (error) {
    throw error;
  }

  if (fetching || !data) {
    return <Loading />;
  }

  const { artworks } = data;

  return (
    <>
      <Meta title="Damon Zucconi" />

      <Stack spacing={6}>
        <Grid cellSize={["9rem", "10rem", "14rem"]}>
          {artworks.map((artwork) => {
            return <ThumbnailArtwork key={artwork.id} artwork={artwork} />;
          })}
        </Grid>
      </Stack>
    </>
  );
};

ArtworksIndexPage.getLayout = NavigationLayout;

export default withUrql(ArtworksIndexPage);

export const getStaticProps = buildGetStaticProps(() => [
  ARTWORKS_INDEX_QUERY,
  { state: [State.Selected] },
]);
