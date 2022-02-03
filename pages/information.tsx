import Head from "next/head";
import { Box, Button, Cell, Input, Stack } from "@auspices/eos";
import { FC } from "react";
import { DefinitionList } from "../components/core/DefinitionList";
import { Page } from "../components/core/Page";
import { Navigation } from "../components/pages/Navigation";

const InformationPage: FC = () => {
  return (
    <>
      <Head>
        <title>Information | Damon Zucconi</title>
      </Head>

      <Page>
        <Stack spacing={6}>
          <Navigation />

          <DefinitionList
            definitions={[
              {
                term: "Contact",
                definition: [
                  { term: "Location", definition: "New York" },
                  { term: "Email", definition: "mail@damonzucconi.com" },
                  { term: "Twitter", definition: "@dzucconi" },
                  { term: "Instagram", definition: "@damonzucconi" },
                  { term: "Are.na", definition: "are.na/damon-zucconi" },
                  { term: "Github", definition: "@dzucconi" },
                  {
                    term: "Artsy",
                    definition: "artsy.net/artist/damon-zucconi",
                  },
                ],
              },
            ]}
          />

          <DefinitionList
            definitions={[
              {
                term: "Representation",
                definition: [
                  { term: "New York, US", definition: "JTT" },
                  { term: "Florence, IT", definition: "Veda" },
                ],
              },
            ]}
          />
          <DefinitionList
            definitions={[
              { term: "View", definition: "CV" },
              { term: "View", definition: "Studio" },
              { term: "View", definition: "reticular.info" },
              { term: "View", definition: "Atlas" },
              { term: "View", definition: "Strata" },
              { term: "View", definition: "Links" },
            ]}
          />

          <Stack width="fit-content">
            <Cell>POPULAR SUBSCRIPTION TO THE MEMORY OF DOT COM</Cell>

            <Stack direction="horizontal">
              <Input placeholder="Your email?" flex="1" />
              <Button>Subscribe</Button>
            </Stack>
          </Stack>

          <DefinitionList
            definitions={[
              {
                term: "Colophon",
                definition: [
                  {
                    term: "Source",
                    definition: "github.com/dzucconi/damonzucconi-archive",
                  },
                  {
                    term: "API",
                    definition: "api.damonzucconi.com/graph",
                  },
                ],
              },
            ]}
          />
        </Stack>
      </Page>
    </>
  );
};

export default InformationPage;
