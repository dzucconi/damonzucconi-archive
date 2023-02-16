import { Banner, Box, Stack } from "@auspices/eos";
import { ReactElement } from "react";
import { Page } from "../core/Page";
import { Navigation } from "../pages/Navigation";

export const NavigationLayout = (page: ReactElement) => (
  <>
    <Banner bg="external">
      <Box
        color="primary"
        as="a"
        href="https://jttnyc.com/exhibitions/marlon-mullen/when-you-re-here-you-re-familiar"
        target="_blank"
      >
        When You’re Here, You’re Familiar — through April 1 @ JTT
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
