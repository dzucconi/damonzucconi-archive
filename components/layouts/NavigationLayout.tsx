import { Banner, Box, Stack } from "@auspices/eos";
import { ReactElement } from "react";
import { Page } from "../core/Page";
import { Navigation } from "../pages/Navigation";

export const NavigationLayout = (page: ReactElement) => (
  <>
    <Banner bg="external" dismissable={false}>
      <Box
        color="currentColor"
        as="a"
        href="https://www.variousartistsrecords.com/zucconi"
        target="_blank"
      >
        Neurofiction — through October 5 @ Various/Artists
      </Box>
    </Banner>

    <Page>
      <Stack spacing={6}>
        <Navigation />

        {page}
      </Stack>
    </Page>
  </>
);
