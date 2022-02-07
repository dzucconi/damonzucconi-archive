import { gql } from "@apollo/client";
import { Box, color, Stack } from "@auspices/eos";
import Head from "next/head";
import styled from "styled-components";
import { Cell } from "../components/core/DefinitionList";
import { Spinner } from "../components/core/Spinner";
import { NavigationLayout } from "../components/layouts/NavigationLayout";
import { useCvPageQuery } from "../generated/graphql";

gql`
  query CvPageQuery {
    cv {
      categories {
        name
        years {
          year
          entries {
            title
            city
            country
            notes
            region
            url
            venue
            to_html
          }
        }
      }
    }
  }
`;

export const CvPage = () => {
  const { data, loading, error } = useCvPageQuery();

  if (error) {
    throw error;
  }

  if (loading || !data) {
    return (
      <>
        <Head>
          <title>Loading | Damon Zucconi</title>
        </Head>

        <Spinner />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>CV | Damon Zucconi</title>
      </Head>

      <Stack spacing={6}>
        {data.cv.categories.map((category) => (
          <Box key={category.name} width="fit-content">
            <Stack direction="horizontal">
              <Cell>{category.name}</Cell>

              <Stack>
                {category.years.map((year, i) => {
                  return (
                    <Stack key={i} direction="horizontal">
                      <Cell>{year.year}</Cell>

                      <Cell display="block" flex={1}>
                        {year.entries.map((entry, j) => {
                          return (
                            <Entry
                              key={`${i}-${j}`}
                              dangerouslySetInnerHTML={{
                                __html: entry.to_html,
                              }}
                            />
                          );
                        })}
                      </Cell>
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>
    </>
  );
};

CvPage.getLayout = NavigationLayout;

export default CvPage;

const Entry = styled(Box)`
  a {
    color: ${color("primary")};
  }
`;
