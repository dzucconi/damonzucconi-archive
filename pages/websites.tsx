import Head from "next/head";
import { Box, Stack } from "@auspices/eos";
import { FC } from "react";
import { Page } from "../components/core/Page";
import { Spinner } from "../components/core/Spinner";
import { gql } from "@apollo/client";
import { useWebsitesQuery } from "../generated/graphql";
import { UrlBar } from "../components/pages/UrlBar";
import { prettifyUrl } from "../lib/prettifyUrl";
import { Navigation } from "../components/pages/Navigation";

gql`
  query WebsitesQuery {
    artworks(state: [SELECTED, PUBLISHED]) {
      id
      links {
        kind
        url
      }
    }
  }
`;

const WebsitesPage: FC = () => {
  const { data, loading, error } = useWebsitesQuery();

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

  const links = data.artworks
    .flatMap((artwork) => artwork.links)
    .filter((link) => link.kind === "canonical");

  return (
    <>
      <Head>
        <title>Only Websites | Damon Zucconi</title>
      </Head>

      <Page>
        <Stack spacing={6}>
          <Navigation />

          {links.map((link) => (
            <Box
              key={link.url}
              as="a"
              href={link.url}
              target="_blank"
              color="external"
              textAlign="center"
              style={{ wordBreak: "break-all" }}
            >
              {prettifyUrl(link.url)}
            </Box>
          ))}
        </Stack>
      </Page>
    </>
  );
};

export default WebsitesPage;
