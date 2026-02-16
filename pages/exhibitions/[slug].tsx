import { PageLayout } from "../../components/layouts/PageLayout";
import { useRouter } from "next/router";
import {
  useExhibitionsShowQuery,
  ExhibitionSlugsQuery,
} from "../../generated/graphql";
import { DefinitionList } from "../../components/core/DefinitionList";
import { HTML, Stack, Box, Grid } from "@auspices/eos/client";
import { Back } from "../../components/core/Back";
import {
  Thumbnail,
  THUMBNAIL_IMAGE_FRAGMENT,
} from "../../components/pages/Thumbnail";
import { Loading } from "../../components/core/Loading";
import { Meta, META_IMAGE_FRAGMENT } from "../../components/core/Meta";
import { gql } from "urql";
import { buildGetStaticProps, client, withUrql } from "../../lib/urql";

const EXHIBITIONS_SHOW_QUERY = gql`
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
      descriptionPlain: description(format: PLAIN)
      images(state: [SELECTED, PUBLISHED]) {
        id
        ...Thumbnail_image
      }
      metaImages: images(state: [SELECTED, PUBLISHED], limit: 1) {
        ...Meta_image
      }
    }
  }
  ${THUMBNAIL_IMAGE_FRAGMENT}
  ${META_IMAGE_FRAGMENT}
`;

const ExhibitionsShowPage = () => {
  const {
    query: { slug },
  } = useRouter();

  const [{ fetching, error, data }] = useExhibitionsShowQuery({
    variables: { id: `${slug}` },
    // skip: !slug, // TODO
  });

  if (error) {
    throw error;
  }

  if (fetching || !data) {
    return <Loading />;
  }

  const { exhibition } = data;
  const zoomImages = exhibition.images.map((image) => image.url);

  const start =
    exhibition.start_year !== exhibition.end_year
      ? `${exhibition.start_date}, ${exhibition.start_year}`
      : exhibition.start_date;

  const end = `${exhibition.end_date}, ${exhibition.end_year}`;

  return (
    <>
      <Meta
        title={`${exhibition.title} (${exhibition.year})`}
        description={exhibition.descriptionPlain ?? ""}
        image={exhibition.metaImages?.[0]?.resized?.urls?.src}
      />

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
              maxWidth={["100%", "100%", "75%", "60%"]}
              html={exhibition.description}
            />
          </Box>
        )}

        {exhibition.images.length > 0 && (
          <Grid cellSize={["9rem", "10rem", "14rem"]}>
            {exhibition.images.map((image, i) => {
              return (
                <Thumbnail
                  key={image.id}
                  image={image}
                  zoomImages={zoomImages}
                  zoomIndex={i}
                />
              );
            })}
          </Grid>
        )}
      </Stack>
    </>
  );
};

ExhibitionsShowPage.getLayout = PageLayout;

export default withUrql(ExhibitionsShowPage);

export const getStaticProps = buildGetStaticProps((ctx) => [
  EXHIBITIONS_SHOW_QUERY,
  { id: ctx.params?.slug },
]);

const EXHIBITION_SLUGS_QUERY = gql`
  query ExhibitionSlugsQuery {
    exhibitions {
      slug
    }
  }
`;

export const getStaticPaths = async () => {
  const { data } = await client
    .query<ExhibitionSlugsQuery>(EXHIBITION_SLUGS_QUERY, {})
    .toPromise();

  const paths = (data?.exhibitions ?? []).flatMap(({ slug }) => {
    if (typeof slug !== "string" || slug.length === 0) {
      return [];
    }

    return [{ params: { slug } }];
  });

  return { paths, fallback: "blocking" };
};
