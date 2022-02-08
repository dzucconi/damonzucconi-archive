import { Box, Stack } from "@auspices/eos";
import { gql } from "@apollo/client";
import { useWebsitesQuery } from "../generated/graphql";
import { prettifyUrl } from "../lib/prettifyUrl";
import { NavigationLayout } from "../components/layouts/NavigationLayout";
import { Loading } from "../components/core/Loading";
import { Meta } from "../components/core/Meta";

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
    return <Loading />;
  }

  const links = data.artworks
    .flatMap((artwork) => artwork.links)
    .filter((link) => link.kind === "canonical");

  return (
    <>
      <Meta title="Only Websites" />

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

WebsitesPage.getLayout = NavigationLayout;

export default WebsitesPage;
