import Head from "next/head";
import { Box, Stack } from "@auspices/eos";
import { ReactElement } from "react";
import { gql } from "@apollo/client";
import { useWebsitesQuery } from "../generated/graphql";
import { prettifyUrl } from "../lib/prettifyUrl";
import { NavigationLayout } from "../components/layouts/NavigationLayout";

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

const WebsitesPage = () => {
  const { data, loading, error } = useWebsitesQuery();

  if (error) {
    throw error;
  }

  if (loading || !data) {
    return (
      <Head>
        <title>Loading | Damon Zucconi</title>
      </Head>
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

      <Stack spacing={6}>
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
    </>
  );
};

WebsitesPage.getLayout = (page: ReactElement) => (
  <NavigationLayout>{page}</NavigationLayout>
);

export default WebsitesPage;
