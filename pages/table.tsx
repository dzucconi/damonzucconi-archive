import { gql } from "@apollo/client";
import Head from "next/head";
import Link from "next/link";
import { Cell, Stack } from "@auspices/eos";
import { Table } from "../components/core/Table";
import { useArtworksTableQuery } from "../generated/graphql";
import { NavigationLayout } from "../components/layouts/NavigationLayout";
import { Spinner } from "../components/core/Spinner";

gql`
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

const ArtworksTablePage = () => {
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

        <Spinner />
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
        <Stack spacing={6}>
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
      </>
    </>
  );
};

ArtworksTablePage.getLayout = NavigationLayout;

export default ArtworksTablePage;
