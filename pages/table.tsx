import { gql } from "@apollo/client";
import Head from "next/head";
import Link from "next/link";
import { Box, Cell, Stack } from "@auspices/eos";
import { Page } from "../components/core/Page";
import { Table } from "../components/core/Table";
import { Navigation } from "../components/pages/Navigation";
import { useArtworksTableQuery } from "../generated/graphql";

const ARTWORKS_INDEX_QUERY = gql`
  query ArtworksTableQuery {
    artworks(state: [SELECTED, PUBLISHED]) {
      id
      slug
      title
      material
      year
    }
  }
`;

const ArtworksTablePage: React.FC = () => {
  const { loading, error, data } = useArtworksTableQuery();

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
        <Page>
          <Stack spacing={6}>
            <Navigation />

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
          </Stack>
        </Page>
      </>
    </>
  );
};

export default ArtworksTablePage;
