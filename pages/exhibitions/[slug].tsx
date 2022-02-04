import { ReactElement } from "react";
import { gql } from "@apollo/client";
import { PageLayout } from "../../components/layouts/PageLayout";
import { useRouter } from "next/router";
import { useExhibitionsShowQuery } from "../../generated/graphql";
import Head from "next/head";
import { Spinner } from "../../components/core/Spinner";
import { DefinitionList } from "../../components/core/DefinitionList";
import { HTML, Stack, ResponsiveImage, Box, Grid, File } from "@auspices/eos";
import styled from "styled-components";

gql`
  query ExhibitionsShowQuery($id: ID!) {
    exhibition(id: $id) {
      title
      venue
      city
      year
      start_date(format: "%B %e")
      end_date(format: "%B %e")
      start_year: start_date(format: "%Y")
      end_year: end_date(format: "%Y")
      external_url
      description(format: HTML)
      images(state: [SELECTED, PUBLISHED]) {
        id
        width
        height
        url
        title
        description
        placeholder: resized(width: 50, height: 50, blur: 10) {
          urls {
            src: _1x
          }
        }
        display: resized(width: 200, height: 200) {
          width
          height
          srcs: urls {
            _1x
            _2x
            _3x
          }
        }
      }
    }
  }
`;

const ExhibitionsShowPage = () => {
  const {
    query: { slug },
  } = useRouter();

  const { loading, error, data } = useExhibitionsShowQuery({
    variables: { id: `${slug}` },
  });

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

  const { exhibition } = data;

  const start =
    exhibition.start_year !== exhibition.end_year
      ? `${exhibition.start_date}, ${exhibition.start_year}`
      : exhibition.start_date;

  const end = `${exhibition.end_date}, ${exhibition.end_year}`;

  return (
    <>
      <Head>
        <title>{exhibition.title} | Damon Zucconi</title>
      </Head>

      <Stack spacing={8}>
        <DefinitionList
          definitions={[
            { term: "Title", definition: exhibition.title },
            {
              term: "Venue",
              definition: exhibition.venue,
              href: exhibition.external_url!,
              target: "_blank",
            },
            { term: "City", definition: exhibition.city },
            { term: "Dates", definition: `${start} – ${end}` },
          ]}
        />

        {exhibition.description && (
          <Box>
            <HTML
              mx="auto"
              lineHeight={2}
              fontSize={3}
              maxWidth={["100%", "85%", "75%", "60%"]}
              html={exhibition.description}
            />
          </Box>
        )}

        {exhibition.images.length > 0 && (
          <Grid cellSize="14rem">
            {exhibition.images.map((image) => {
              return (
                <File
                  name={image.title!}
                  meta={image.description!}
                  selected
                  // @ts-ignore
                  as="a"
                >
                  <ResponsiveImage
                    placeholder={image.placeholder.urls.src}
                    srcs={[
                      image.display.srcs._1x,
                      image.display.srcs._2x,
                      image.display.srcs._3x,
                    ]}
                    aspectWidth={image.display.width}
                    aspectHeight={image.display.height}
                    maxWidth={image.display.width}
                    maxHeight={image.display.height}
                    alt={exhibition.title ?? ""}
                    loading="lazy"
                  />
                </File>
              );
            })}
          </Grid>
        )}
      </Stack>
    </>
  );
};

export default ExhibitionsShowPage;

ExhibitionsShowPage.getLayout = (page: ReactElement) => (
  <PageLayout>{page}</PageLayout>
);

// TODO: Extract
const Figure = styled(Box).attrs({ as: "figure" })`
  button {
    opacity: 0;
    transition: 100ms opacity;
  }

  &:hover {
    button {
      opacity: 1;
    }
  }
`;
