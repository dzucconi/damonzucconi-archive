import {
  Box,
  Button,
  Caret,
  Cell,
  Dropdown,
  Input,
  PaneOption,
  Stack,
} from "@auspices/eos/client";
import { DefinitionList } from "../components/core/DefinitionList";
import { NavigationLayout } from "../components/layouts/NavigationLayout";
import { Meta } from "../components/core/Meta";
import { useTheme } from "next-themes";

const THEME_OPTIONS = [
  { label: "System", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

const InformationPage = () => {
  const { theme, setTheme } = useTheme();

  const selectedLabel =
    THEME_OPTIONS.find((o) => o.value === theme)?.label ?? "System";
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
                  term: "X",
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
                  term: "Spotify",
                  definition: "spotify:4QC1cXBGcYNXkMchdzPzrx",
                  href: "https://open.spotify.com/artist/4QC1cXBGcYNXkMchdzPzrx?si=d2vbeZo7ScmaUXF072YttQ",
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

        <Box as="dl">
          <Stack width="fit-content">
            <Stack direction="horizontal">
              <Cell variant="small" as="dt">
                Preferences
              </Cell>

              <Box as="dd" flex="1">
                <Box as="dl" width="100%">
                  <Stack direction="horizontal">
                    <Cell variant="small" as="dt">
                      Theme
                    </Cell>

                    <Box as="dd" flex="1">
                      <Dropdown
                        label={({
                          open,
                          ref,
                          disabled,
                          onMouseDown,
                          onClick,
                        }) => (
                          <Button
                            ref={ref}
                            variant="small"
                            disabled={disabled}
                            onMouseDown={onMouseDown}
                            onClick={onClick}
                            type="button"
                            width="100%"
                          >
                            {selectedLabel}
                            <Caret ml={3} direction={open ? "up" : "down"} />
                          </Button>
                        )}
                      >
                        {({ handleClose }) =>
                          THEME_OPTIONS.map((option) => (
                            <PaneOption
                              key={option.value}
                              fontSize={[0, 0, 1]}
                              px={3}
                              py={2}
                              onClick={() => {
                                setTheme(option.value);
                                handleClose();
                              }}
                            >
                              {option.label}
                            </PaneOption>
                          ))
                        }
                      </Dropdown>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

InformationPage.getLayout = NavigationLayout;

export default InformationPage;
