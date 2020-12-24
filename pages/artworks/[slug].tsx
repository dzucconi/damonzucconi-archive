import { gql } from "@apollo/client";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import {
  Box,
  Stack,
  ResponsiveImage,
  AspectRatioBox,
  HTML,
  Dropdown,
  Ellipsis,
  PaneOption,
} from "@auspices/eos";
import { Tombstone } from "../../components/pages/Tombstone";
import { UrlBar } from "../../components/pages/UrlBar";
import { SkeletonBox, SkeletonText } from "../../components/core/Skeleton";
import { useArtworksShowQuery } from "../../generated/graphql";
import { Bleed, Page } from "../../components/core/Page";

const ARTWORKS_SHOW_QUERY = gql`
  query ArtworksShowQuery($id: ID!) {
    artwork(id: $id) {
      ...TombstoneArtworkFragment
      id
      slug
      src
      title
      year
      description(format: HTML)
      collector_byline
      images(state: PUBLISHED) {
        id
        width
        height
        url
        display: resized(width: 1400, height: 1400) {
          width
          height
          srcs: urls {
            _1x
            _2x
            _3x
          }
        }
      }
    }
  }
`;

export const ArtworksShowPage: React.FC = () => {
  const {
    query: { slug },
  } = useRouter();

  const { loading, error, data } = useArtworksShowQuery({
    variables: { id: `${slug}` },
  });

  if (error) {
    throw error;
  }

  if (loading || !data) {
    return (
      <Page>
        <Stack spacing={6}>
          <AspectRatioBox
            aspectWidth={4}
            aspectHeight={3}
            maxWidth={2000}
            maxHeight={2000}
          >
            <SkeletonBox width="100%" height="100%" />
          </AspectRatioBox>

          <SkeletonText>Untitled, Non-material, xx x xxx, 0000</SkeletonText>
        </Stack>
      </Page>
    );
  }

  const { artwork } = data;

  return (
    <>
      <Head>
        <title>
          {artwork.title} ({artwork.year}); Damon Zucconi
        </title>
      </Head>

      <Page>
        <Stack direction="vertical" spacing={6}>
          {artwork.src && (
            <Stack direction="vertical" spacing={6} pb={6}>
              <Box position="relative">
                <UrlBar as="a" href={artwork.src} target="_blank">
                  {artwork.src}
                </UrlBar>

                <Box
                  position="absolute"
                  fontSize={0}
                  right={0}
                  top="100%"
                  p={3}
                  color="secondary"
                >
                  Open work in new tab
                </Box>
              </Box>
            </Stack>
          )}

          {artwork.images.length > 0 && (
            <Stack direction="vertical" spacing={6}>
              {artwork.images.map((image) => {
                return (
                  <Box key={image.id} position="relative">
                    <Dropdown
                      label={<Ellipsis />}
                      position="absolute"
                      zIndex={2}
                      top={5}
                      right={5}
                    >
                      <PaneOption as="a" href={image.url} target="_blank">
                        Download file @{image.width}&times;{image.height}
                      </PaneOption>
                    </Dropdown>

                    <ResponsiveImage
                      srcs={[
                        image.display.srcs._1x,
                        image.display.srcs._2x,
                        image.display.srcs._3x,
                      ]}
                      aspectWidth={image.display.width}
                      aspectHeight={image.display.height}
                      maxWidth={image.display.width}
                      maxHeight={image.display.height}
                      alt={artwork.title}
                      indicator
                    />
                  </Box>
                );
              })}
            </Stack>
          )}

          <Tombstone artwork={artwork} />

          {artwork.collector_byline && (
            <Box lineHeight={2} color="primary" mx="auto">
              {artwork.collector_byline}
            </Box>
          )}

          {artwork.description && (
            <HTML
              mx="auto"
              textColor="primary"
              lineHeight={1}
              fontSize={3}
              maxWidth={["100%", "85%", "75%", "60%"]}
              html={artwork.description}
            />
          )}
        </Stack>
      </Page>
    </>
  );
};

export default ArtworksShowPage;
