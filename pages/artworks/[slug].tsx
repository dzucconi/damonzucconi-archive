import { gql } from "@apollo/client";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import {
  Box,
  Stack,
  ResponsiveImage,
  HTML,
  Dropdown,
  Ellipsis,
  PaneOption,
  Clickable,
} from "@auspices/eos";
import { Tombstone } from "../../components/pages/Tombstone";
import { UrlBar } from "../../components/pages/UrlBar";
import { useArtworksShowQuery } from "../../generated/graphql";
import styled from "styled-components";
import { Embed } from "../../components/pages/Embed";
import { Spinner } from "../../components/core/Spinner";
import { PageLayout } from "../../components/layouts/PageLayout";
import { ReactElement } from "react";

gql`
  query ArtworksShowQuery($id: ID!) {
    artwork(id: $id) {
      ...TombstoneArtworkFragment
      id
      slug
      src
      title
      year
      intent
      description(format: HTML)
      descriptionPlain: description(format: PLAIN)
      attachments {
        id
        url
        title
      }
      links(kind: DEFAULT, state: PUBLISHED) {
        title
        url
      }
      embeds {
        id
        html
      }
      images(state: PUBLISHED) {
        id
        width
        height
        url
        placeholder: resized(width: 50, height: 50, blur: 10) {
          urls {
            src: _1x
          }
        }
        display: resized(width: 1200, height: 1200) {
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

export const ArtworksShowPage = () => {
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
      <>
        <Head>
          <title>Loading | Damon Zucconi</title>
        </Head>

        <Spinner />
      </>
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

      <Stack direction="vertical" spacing={8}>
        {artwork.src && (
          <Stack direction="vertical" spacing={6}>
            <Box position="relative">
              <UrlBar href={artwork.src} target="_blank">
                {artwork.src}
              </UrlBar>

              <Box
                position="absolute"
                fontSize={0}
                right={0}
                top="100%"
                p={3}
                color="secondary"
                as="a"
                href={artwork.src}
                target="_blank"
                tabIndex={-1}
              >
                Open work in new tab
              </Box>
            </Box>
          </Stack>
        )}

        {artwork.embeds.length > 0 && (
          <Stack direction="vertical" spacing={6}>
            {artwork.embeds.map((embed) => (
              <Embed key={embed.id} html={embed.html!} mx="auto" />
            ))}
          </Stack>
        )}

        {["default", "canonical"].includes(artwork.intent) &&
          artwork.images.length > 0 && (
            <Stack direction="vertical" spacing={6}>
              {artwork.images.map((image) => {
                return (
                  <Figure key={image.id}>
                    <ResponsiveImage
                      indicator
                      placeholder={image.placeholder.urls.src}
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
                    >
                      <Dropdown
                        label={
                          <Clickable bg="background" p={3}>
                            <Ellipsis />
                          </Clickable>
                        }
                        position="absolute"
                        zIndex={1}
                        top={5}
                        right={5}
                      >
                        <PaneOption as="a" href={image.url} target="_blank">
                          Download image @{image.width}&times;{image.height}
                        </PaneOption>
                      </Dropdown>
                    </ResponsiveImage>
                  </Figure>
                );
              })}
            </Stack>
          )}

        {artwork.attachments.length > 0 && (
          <Stack direction="vertical" spacing={2} textAlign="center">
            {artwork.attachments.map((attachment) => {
              return (
                <Box
                  as="a"
                  href={attachment.url}
                  target="_blank"
                  lineHeight={2}
                  fontSize={3}
                  color="external"
                >
                  {attachment.title}
                </Box>
              );
            })}
          </Stack>
        )}

        {artwork.links.length > 0 && (
          <Stack direction="vertical" spacing={2} textAlign="center">
            {artwork.links.map((link) => {
              return (
                <Box
                  as="a"
                  href={link.url}
                  target="_blank"
                  lineHeight={2}
                  fontSize={3}
                  color="external"
                >
                  {link.title}
                </Box>
              );
            })}
          </Stack>
        )}

        {artwork.description && (
          <Box>
            <HTML
              html={artwork.description}
              mx="auto"
              lineHeight={2}
              fontSize={3}
              maxWidth={["100%", "85%", "75%", "60%"]}
              textAlign={
                (artwork.descriptionPlain?.length ?? 0) > 99 ? "left" : "center"
              }
            />
          </Box>
        )}

        <Tombstone artwork={artwork} />
      </Stack>
    </>
  );
};

ArtworksShowPage.getLayout = (page: ReactElement) => (
  <PageLayout>{page}</PageLayout>
);

export default ArtworksShowPage;

const Figure = styled(Box).attrs({ as: "figure" })`
  button {
    opacity: 0;
    transition: 100ms opacity;
  }

  &:hover {
    button {
      opacity: 1;
    }
  }
`;
