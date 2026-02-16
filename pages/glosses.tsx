import { Box, Stack } from "@auspices/eos/client";
import { gql } from "urql";
import { prettifyUrl } from "../lib/prettifyUrl";
import { NavigationLayout } from "../components/layouts/NavigationLayout";
import { Loading } from "../components/core/Loading";
import { Meta } from "../components/core/Meta";
import { buildGetStaticProps, withUrql } from "../lib/urql";
import { useGlossesQuery } from "../generated/graphql";

const GLOSSES_QUERY = gql`
  query GlossesQuery {
    artworks(state: [SELECTED, PUBLISHED]) {
      id
      gloss
      slug
    }
  }
`;

const GlossesPage = () => {
  const [{ fetching, data, error }] = useGlossesQuery();

  if (error) {
    throw error;
  }

  if (fetching || !data) {
    return <Loading />;
  }

  const artworks = data.artworks.filter((artwork) => artwork.gloss);

  return (
    <>
      <Meta title="Glosses" />

      <Stack spacing={6}>
        {artworks.map((artwork) => (
          <Box
            key={artwork.slug}
            as="a"
            href={`/artworks/${artwork.slug}`}
            target="_blank"
            color="external"
            textAlign="center"
            // @ts-ignore
            style={{ textWrap: "balance" }}
          >
            {artwork.gloss}
          </Box>
        ))}
      </Stack>
    </>
  );
};

GlossesPage.getLayout = NavigationLayout;

export default withUrql(GlossesPage);

export const getStaticProps = buildGetStaticProps(() => [GLOSSES_QUERY]);
