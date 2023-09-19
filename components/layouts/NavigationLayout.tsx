import { Banner, Box, Stack } from "@auspices/eos";
import { ReactElement } from "react";
import { Page } from "../core/Page";
import { Navigation } from "../pages/Navigation";

export const NavigationLayout = (page: ReactElement) => (
  <>
    <Banner bg="external">
      <Box
        color="currentColor"
        as="a"
        href="https://www.spazioveda.it/"
        target="_blank"
      >
        Self-Titled — through November 11 @ Veda
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
