import { gql } from "@apollo/client";
import Head from "next/head";
import Link from "next/link";
import {
  AspectRatioBox,
  Box,
  File,
  Grid,
  ResponsiveImage,
  Stack,
} from "@auspices/eos";
import { Page } from "../components/core/Page";
import { Search } from "../components/pages/Search";
import { useArtworksIndexQuery } from "../generated/graphql";

const ARTWORKS_INDEX_QUERY = gql`
  query ArtworksIndexQuery {
    artworks(state: [SELECTED, PUBLISHED]) {
      id
      slug
      title
      material
      year
      images(limit: 1, state: PUBLISHED) {
        placeholder: resized(width: 50, height: 50) {
          urls {
            src: _1x
          }
        }
        resized(width: 200, height: 200) {
          width
          height
          urls {
            _1x
            _2x
            _3x
          }
        }
      }
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

        <Page>
          <Search />
        </Page>
      </>
    );
  }

  const { artworks } = data;

  return (
    <>
      <Head>
        <title>Damon Zucconi</title>
      </Head>

      <Page>
        <Search />

        <Grid>
          {artworks.map((artwork) => {
            const [image] = artwork.images;

            return (
              <Link
                key={artwork.id}
                href={`/artworks/${artwork.slug}`}
                aria-label={`${artwork.title}; ${artwork.material} (${artwork.year})`}
                passHref
              >
                <File
                  name={artwork.title}
                  selected
                  // @ts-ignore
                  as="a"
                >
                  {image ? (
                    <ResponsiveImage
                      placeholder={image.placeholder.urls.src}
                      srcs={[
                        image.resized.urls._1x,
                        image.resized.urls._2x,
                        image.resized.urls._3x,
                      ]}
                      aspectWidth={image.resized.width}
                      aspectHeight={image.resized.height}
                      maxWidth={image.resized.width}
                      maxHeight={image.resized.height}
                      alt={artwork.title}
                      loading="lazy"
                    />
                  ) : (
                    <AspectRatioBox
                      aspectWidth={
                        Math.floor(Math.random() * (100 - 1 + 1)) + 1
                      }
                      aspectHeight={
                        Math.floor(Math.random() * (100 - 1 + 1)) + 1
                      }
                      maxWidth={200}
                      maxHeight={200}
                      bg="tertiary"
                    />
                  )}
                </File>
              </Link>
            );
          })}
        </Grid>
      </Page>
    </>
  );
};

export default ArtworksIndexPage;
