import { Box, Stack } from "@auspices/eos";
import { gql } from "urql";
import { useWebsitesQuery } from "../generated/graphql";
import { prettifyUrl } from "../lib/prettifyUrl";
import { NavigationLayout } from "../components/layouts/NavigationLayout";
import { Loading } from "../components/core/Loading";
import { Meta } from "../components/core/Meta";
import { buildGetStaticProps, withUrql } from "../lib/urql";
import { BackToTop } from "../components/core/BackToTop";

const WEBSITES_QUERY = gql`
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
  const [{ fetching, data, error }] = useWebsitesQuery();

  if (error) {
    throw error;
  }

  if (fetching || !data) {
    return <Loading />;
  }

  const links = data.artworks
    .flatMap((artwork) => artwork.links)
    .filter((link) => link.kind === "CANONICAL");

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

      <BackToTop />
    </>
  );
};

WebsitesPage.getLayout = NavigationLayout;

export default withUrql(WebsitesPage);

export const getStaticProps = buildGetStaticProps(() => [WEBSITES_QUERY]);
