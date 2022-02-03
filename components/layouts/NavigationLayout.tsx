import { Stack } from "@auspices/eos";
import { FC } from "react";
import { Page } from "../core/Page";
import { Navigation } from "../pages/Navigation";

export const NavigationLayout: FC = ({ children }) => {
  return (
    <Page>
      <Stack spacing={6}>
        <Navigation />

        {children}
      </Stack>
    </Page>
  );
};
