import { gql } from "urql";
import { Box, color, Stack } from "@auspices/eos/client";
import styled from "styled-components";
import { Cell } from "../components/core/DefinitionList";
import { Loading } from "../components/core/Loading";
import { Meta } from "../components/core/Meta";
import { NavigationLayout } from "../components/layouts/NavigationLayout";
import { useCvPageQuery } from "../generated/graphql";
import { withUrql, buildGetStaticProps } from "../lib/urql";

const CV_PAGE_QUERY = gql`
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
  const [{ fetching, data, error }] = useCvPageQuery();

  if (error) {
    throw error;
  }

  if (fetching || !data) {
    return <Loading />;
  }

  return (
    <>
      <Meta title="CV" />

      <Stack spacing={6}>
        {data.cv.categories.map((category) => (
          <Box key={category.name} width="fit-content">
            <Stack direction={["vertical", "vertical", "horizontal"]}>
              <Cell>{category.name}</Cell>

              <Stack>
                {category.years.map((year, i) => {
                  return (
                    <Stack
                      key={i}
                      direction={["vertical", "vertical", "horizontal"]}
                    >
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

const Entry = styled(Box)`
  a {
    color: ${color("primary")};
  }
`;

CvPage.getLayout = NavigationLayout;

export default withUrql(CvPage);

export const getStaticProps = buildGetStaticProps(() => [CV_PAGE_QUERY]);
