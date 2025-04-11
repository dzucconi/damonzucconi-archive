import { Grid, Stack } from "@auspices/eos";
import { State, useArtworksIndexQuery } from "../generated/graphql";
import { NavigationLayout } from "../components/layouts/NavigationLayout";
import { Loading } from "../components/core/Loading";
import { Meta } from "../components/core/Meta";
import { ThumbnailArtwork } from "../components/pages/ThumbnailArtwork";
import { buildGetStaticProps, withUrql } from "../lib/urql";
import { ARTWORKS_INDEX_QUERY } from "./index";
import { BackToTop } from "../components/core/BackToTop";

const ArtworksArtworksPage = () => {
  const [{ fetching, error, data }] = useArtworksIndexQuery({
    variables: { state: [State.Selected, State.Published] },
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

      <BackToTop />
    </>
  );
};

ArtworksArtworksPage.getLayout = NavigationLayout;

export default withUrql(ArtworksArtworksPage);

export const getStaticProps = buildGetStaticProps(() => [
  ARTWORKS_INDEX_QUERY,
  { state: [State.Selected, State.Published] },
]);
