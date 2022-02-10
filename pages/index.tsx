import { State } from "../generated/graphql";
import { buildGetStaticProps, withUrql } from "../lib/urql";
import { ArtworksIndexPage, ARTWORKS_INDEX_QUERY } from "../templates/index";

export default withUrql(ArtworksIndexPage);

export const getStaticProps = buildGetStaticProps(() => [
  ARTWORKS_INDEX_QUERY,
  { state: [State.Selected] },
]);
