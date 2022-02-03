import { gql } from "@apollo/client";
import Head from "next/head";
import Link from "next/link";
import {
  Box,
  Button,
  EmptyFrame,
  File,
  Grid,
  ResponsiveImage,
  Stack,
} from "@auspices/eos";
import { Page } from "../components/core/Page";
import { Search } from "../components/pages/Search";
import { State, useArtworksIndexQuery } from "../generated/graphql";
import { Navigation } from "../components/pages/Navigation";
import { useRouter } from "next/router";

gql`
  query ArtworksIndexQuery($state: [State]) {
    artworks(state: $state) {
      id
      slug
      title
      material
      year
      images(limit: 1, state: PUBLISHED) {
        placeholder: resized(width: 50, height: 50, blur: 10) {
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
  const router = useRouter();
  const state =
    router.asPath === "/"
      ? [State.Selected]
      : [State.Selected, State.Published];

  const { loading, error, data } = useArtworksIndexQuery({
    variables: { state },
  });

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
          <Navigation loading />
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
        <Stack spacing={6}>
          <Navigation />

          <Grid cellSize="14rem">
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
                    meta={`${artwork.year}`}
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
                      <EmptyFrame
                        width="100%"
                        height="100%"
                        color="hint"
                        border="1px solid"
                        borderColor="hint"
                      />
                    )}
                  </File>
                </Link>
              );
            })}
          </Grid>
        </Stack>
      </Page>
    </>
  );
};

export default ArtworksIndexPage;
