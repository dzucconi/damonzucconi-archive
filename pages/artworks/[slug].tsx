import { gql } from "@apollo/client";
import { useRouter } from "next/router";
import Head from "next/head";
import { Box, Stack, HTML, Grid } from "@auspices/eos";
import { Tombstone } from "../../components/pages/Tombstone";
import { UrlBar } from "../../components/pages/UrlBar";
import { useArtworksShowQuery } from "../../generated/graphql";
import { Embed } from "../../components/pages/Embed";
import { Spinner } from "../../components/core/Spinner";
import { PageLayout } from "../../components/layouts/PageLayout";
import { Back } from "../../components/core/Back";
import { Figure } from "../../components/pages/Figure";
import { Thumbnail } from "../../components/pages/Thumbnail";

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
        ...Figure_image
        ...Thumbnail_image
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
        <Stack width="fit-content">
          <Back />

          <Tombstone artwork={artwork} />
        </Stack>

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

        {artwork.intent === "default" && artwork.images.length > 0 && (
          <Stack direction="vertical" spacing={6}>
            {artwork.images.map((image) => {
              return <Figure key={image.id} image={image} />;
            })}
          </Stack>
        )}

        {artwork.intent === "canonical" && artwork.images.length > 0 && (
          <Grid cellSize="14rem">
            {artwork.images.map((image) => {
              return <Thumbnail key={image.id} image={image} />;
            })}
          </Grid>
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
      </Stack>
    </>
  );
};

ArtworksShowPage.getLayout = PageLayout;

export default ArtworksShowPage;
