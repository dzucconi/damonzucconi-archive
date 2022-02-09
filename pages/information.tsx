import { Box, Button, Cell, Input, Stack } from "@auspices/eos";
import { DefinitionList } from "../components/core/DefinitionList";
import { NavigationLayout } from "../components/layouts/NavigationLayout";
import { Meta } from "../components/core/Meta";

const InformationPage = () => {
  return (
    <>
      <Meta title="Information" />

      <Stack spacing={6}>
        <DefinitionList
          definitions={[
            {
              term: "Contact",
              definition: [
                { term: "Location", definition: "New York" },
                {
                  term: "Email",
                  definition: "mail@damonzucconi.com",
                  href: "mailto:mail@damonzucconi.com",
                },
                {
                  term: "Twitter",
                  definition: "@dzucconi",
                  href: "https://twitter.com/dzucconi",
                  target: "_blank",
                },
                {
                  term: "Instagram",
                  definition: "@damonzucconi",
                  href: "https://instagram.com/damonzucconi",
                  target: "_blank",
                },
                {
                  term: "Are.na",
                  definition: "are.na/damon-zucconi",
                  href: "https://www.are.na/damon-zucconi",
                  target: "_blank",
                },
                {
                  term: "Github",
                  definition: "@dzucconi",
                  href: "https://github.com/dzucconi",
                  target: "_blank",
                },
                {
                  term: "Artsy",
                  definition: "artsy.net/artist/damon-zucconi",
                  href: "https://artsy.net/artist/damon-zucconi",
                  target: "_blank",
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
                {
                  term: "New York, US",
                  definition: "JTT",
                  href: "https://www.jttnyc.com/",
                  target: "_blank",
                },
                {
                  term: "Florence, IT",
                  definition: "Veda",
                  href: "https://www.spazioveda.it/",
                  target: "_blank",
                },
              ],
            },
          ]}
        />

        <DefinitionList
          definitions={[
            { term: "View", definition: "CV", href: "/cv" },
            {
              term: "View",
              definition: "Studio",
              href: "https://atlas.damonzucconi.com/studio",
              target: "_blank",
            },
            {
              term: "View",
              definition: "reticular.info",
              href: "https://www.reticular.info/",
              target: "_blank",
            },
            {
              term: "View",
              definition: "Atlas",
              href: "https://atlas.damonzucconi.com/",
              target: "_blank",
            },
            {
              term: "View",
              definition: "Strata",
              href: "https://strata.damonzucconi.com/",
              target: "_blank",
            },
            {
              term: "View",
              definition: "Links",
              href: "https://links.damonzucconi.com/",
              target: "_blank",
            },
          ]}
        />

        <Box
          as="form"
          action="//damonzucconi.us10.list-manage.com/subscribe/post?u=70514bcb9018b1c17643e3cad&amp;id=e19d56df5e"
          method="post"
          target="_blank"
          noValidate
        >
          <Stack width="fit-content" maxWidth="100%">
            <Cell>POPULAR SUBSCRIPTION TO THE MEMORY OF DOT COM</Cell>

            <Stack direction="horizontal">
              <Input
                placeholder="Your email?"
                flex="1"
                name="EMAIL"
                type="email"
                required
                minWidth={0}
              />

              <Box position="absolute" left={-5000}>
                <input
                  type="text"
                  name="b_70514bcb9018b1c17643e3cad_e19d56df5e"
                  tabIndex={-1}
                  value=""
                />
              </Box>

              <Button type="submit" name="subscribe">
                Subscribe
              </Button>
            </Stack>
          </Stack>
        </Box>

        <DefinitionList
          definitions={[
            {
              term: "Colophon",
              definition: [
                {
                  term: "Source",
                  definition: "github.com/dzucconi/damonzucconi-archive",
                  href: "https://github.com/dzucconi/damonzucconi-archive",
                  target: "_blank",
                  style: { wordBreak: "break-all" },
                },
                {
                  term: "API",
                  definition: "api.damonzucconi.com/graph",
                  href: "https://api.damonzucconi.com/graph",
                  target: "_blank",
                },
              ],
            },
          ]}
        />
      </Stack>
    </>
  );
};

InformationPage.getLayout = NavigationLayout;

export default InformationPage;
