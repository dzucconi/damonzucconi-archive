import { Stack } from "@auspices/eos/client";
import { ReactElement } from "react";
import { Page } from "../core/Page";
import { Navigation } from "../pages/Navigation";

export const NavigationLayout = (page: ReactElement) => (
  <Page>
    <Stack spacing={6}>
      <Navigation />

      {page}
    </Stack>
  </Page>
);
