import { State } from "../generated/graphql";
import { buildGetStaticProps, withUrql } from "../lib/urql";
import { ArtworksIndexPage, ARTWORKS_INDEX_QUERY } from "../templates/index";

const ArtworksArtworksPage = () => {
  return <ArtworksIndexPage />;
};

ArtworksArtworksPage.getLayout = ArtworksIndexPage.getLayout;

export default withUrql(ArtworksArtworksPage);

export const getStaticProps = buildGetStaticProps(() => [
  ARTWORKS_INDEX_QUERY,
  { state: [State.Selected, State.Published] },
]);
