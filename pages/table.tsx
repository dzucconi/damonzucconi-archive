import { gql } from "urql";
import Link from "next/link";
import { Cell, Stack } from "@auspices/eos";
import { Table } from "../components/core/Table";
import { useArtworksTableQuery } from "../generated/graphql";
import { NavigationLayout } from "../components/layouts/NavigationLayout";
import { Loading } from "../components/core/Loading";
import { Meta } from "../components/core/Meta";

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
  const [{ fetching, error, data }] = useArtworksTableQuery();

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
