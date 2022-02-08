import { gql } from "@apollo/client";
import { PageLayout } from "../../components/layouts/PageLayout";
import { useRouter } from "next/router";
import { useExhibitionsShowQuery } from "../../generated/graphql";
import { DefinitionList } from "../../components/core/DefinitionList";
import { HTML, Stack, Box, Grid } from "@auspices/eos";
import { Back } from "../../components/core/Back";
import { Thumbnail } from "../../components/pages/Thumbnail";
import { Loading } from "../../components/core/Loading";
import { Meta } from "../../components/core/Meta";

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
        ...Thumbnail_image
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
    return <Loading />;
  }

  const { exhibition } = data;

  const start =
    exhibition.start_year !== exhibition.end_year
      ? `${exhibition.start_date}, ${exhibition.start_year}`
      : exhibition.start_date;

  const end = `${exhibition.end_date}, ${exhibition.end_year}`;

  return (
    <>
      <Meta title={`${exhibition.title} (${exhibition.year})`} />

      <Stack spacing={8}>
        <Stack width="fit-content">
          <Back href="/exhibitions" />

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
        </Stack>

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
              return <Thumbnail key={image.id} image={image} />;
            })}
          </Grid>
        )}
      </Stack>
    </>
  );
};

export default ExhibitionsShowPage;

ExhibitionsShowPage.getLayout = PageLayout;
