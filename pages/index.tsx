import { gql } from "@apollo/client";
import Link from "next/link";
import { EmptyFrame, File, Grid, ResponsiveImage, Stack } from "@auspices/eos";
import { State, useArtworksIndexQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { NavigationLayout } from "../components/layouts/NavigationLayout";
import { Loading } from "../components/core/Loading";
import { Meta } from "../components/core/Meta";
import { NextPageContext } from "next";
import { initApolloClient } from "../lib/apolloClient";

const ARTWORKS_INDEX_QUERY = gql`
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

const ArtworksIndexPage = () => {
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
    return <Loading />;
  }

  const { artworks } = data;

  return (
    <>
      <Meta title="Damon Zucconi" />

      <Stack spacing={6}>
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
    </>
  );
};

ArtworksIndexPage.getLayout = NavigationLayout;

export default ArtworksIndexPage;

ArtworksIndexPage.getInitialProps = async (context: NextPageContext) => {
  const apolloClient = initApolloClient();

  const state =
    context.asPath === "/"
      ? [State.Selected]
      : [State.Selected, State.Published];

  await apolloClient.query({
    query: ARTWORKS_INDEX_QUERY,
    variables: { state },
  });

  return {
    props: { initialApolloState: apolloClient.cache.extract() },
  };
};
