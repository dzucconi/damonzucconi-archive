import { gql } from "@apollo/client";
import Head from "next/head";
import Link from "next/link";
import { Box, Cell, Stack } from "@auspices/eos";
import { Page } from "../components/core/Page";
import { Table } from "../components/core/Table";
import { Navigation } from "../components/pages/Navigation";
import { useArtworksIndexQuery } from "../generated/graphql";
import { initApolloClient } from "../lib/apolloClient";

const ARTWORKS_INDEX_QUERY = gql`
  query ArtworksIndexQuery {
    artworks(state: [SELECTED, PUBLISHED]) {
      id
      slug
      title
      material
      year
    }
  }
`;

const ArtworksIndexPage: React.FC = () => {
  const { loading, error, data } = useArtworksIndexQuery();

  if (error) {
    throw error;
  }

  if (loading || !data) {
    return (
      <>
        <Head>
          <title>Loading | Damon Zucconi</title>
        </Head>

        <>
          <Cell borderWidth={0} borderBottom="1px solid">
            loading...
          </Cell>

          <Page>
            <Navigation />
          </Page>
        </>
      </>
    );
  }

  const { artworks } = data;

  return (
    <>
      <Head>
        <title>Damon Zucconi</title>
      </Head>

      <>
        <Cell borderWidth={0} borderBottom="1px solid">
          —
        </Cell>

        <Page>
          <Stack spacing={6}>
            <Navigation />

            <Box maxHeight={600} overflowY="auto" border="1px solid">
              <Table position="relative" borderWidth={0}>
                <thead>
                  <tr>
                    <th>
                      <Cell borderWidth={0}>title</Cell>
                    </th>
                    <th>
                      <Cell borderWidth={0}>material</Cell>
                    </th>
                    <th>
                      <Cell borderWidth={0} textAlign="center">
                        year
                      </Cell>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {artworks.map((artwork) => {
                    return (
                      <tr>
                        <td>
                          <Link
                            key={artwork.id}
                            href={`/artworks/${artwork.slug}`}
                            aria-label={`${artwork.title}; ${artwork.material} (${artwork.year})`}
                            passHref
                          >
                            <Cell as="a" borderWidth={0} display="block">
                              {artwork.title}
                            </Cell>
                          </Link>
                        </td>

                        <td>
                          <Cell borderWidth={0}>{artwork.material}</Cell>
                        </td>

                        <td>
                          <Cell borderWidth={0} textAlign="center">
                            {artwork.year}
                          </Cell>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Box>
          </Stack>
        </Page>
      </>
    </>
  );
};

// export const getStaticProps = async () => {
//   const apolloClient = initApolloClient();
//   await apolloClient.query({ query: ARTWORKS_INDEX_QUERY });
//   return {
//     props: { initialApolloState: apolloClient.cache.extract() },
//     revalidate: 1,
//   };
// };

export default ArtworksIndexPage;
