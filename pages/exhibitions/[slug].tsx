import { PageLayout } from "../../components/layouts/PageLayout";
import { useRouter } from "next/router";
import {
  useExhibitionsShowQuery,
  ExhibitionSlugsQuery,
} from "../../generated/graphql";
import { Cell, DefinitionList } from "../../components/core/DefinitionList";
import { HTML, Stack, Box, Grid } from "@auspices/eos/client";
import { Back } from "../../components/core/Back";
import {
  Thumbnail,
  THUMBNAIL_IMAGE_FRAGMENT,
} from "../../components/pages/Thumbnail";
import {
  ThumbnailArtwork,
  THUMBNAIL_ARTWORK_FRAGMENT,
} from "../../components/pages/ThumbnailArtwork";
import { Loading } from "../../components/core/Loading";
import { Meta, META_IMAGE_FRAGMENT } from "../../components/core/Meta";
import { gql } from "urql";
import { buildGetStaticProps, client, withUrql } from "../../lib/urql";
import { ReactNode } from "react";

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
      curators {
        id
        name
        website_url
      }
      artists {
        id
        name
        website_url
      }
      artworks(state: [SELECTED, PUBLISHED]) {
        id
        ...ThumbnailArtwork_artwork
      }
      images(state: [SELECTED, PUBLISHED]) {
        id
        ...Thumbnail_image
      }
      metaImages: images(state: [SELECTED, PUBLISHED], limit: 1) {
        ...Meta_image
      }
    }
  }
  ${THUMBNAIL_ARTWORK_FRAGMENT}
  ${THUMBNAIL_IMAGE_FRAGMENT}
  ${META_IMAGE_FRAGMENT}
`;

const isPresent = (value?: string | number | null): value is string | number =>
  value !== null && value !== undefined && `${value}` !== "";

const formatExhibitionDates = (exhibition: {
  start_date?: string | null;
  end_date?: string | null;
  start_year?: string | null;
  end_year?: string | null;
  year?: number | null;
}) => {
  const { start_date, end_date, start_year, end_year, year } = exhibition;

  if (isPresent(start_date) && isPresent(end_date)) {
    const start =
      start_year !== end_year && isPresent(start_year)
        ? `${start_date}, ${start_year}`
        : start_date;
    const end = isPresent(end_year) ? `${end_date}, ${end_year}` : end_date;

    return `${start} – ${end}`;
  }

  if (isPresent(start_date)) {
    return isPresent(start_year) ? `${start_date}, ${start_year}` : start_date;
  }

  if (isPresent(end_date)) {
    return isPresent(end_year) ? `${end_date}, ${end_year}` : end_date;
  }

  if (isPresent(year)) {
    return `${year}`;
  }

  return undefined;
};

const peopleDefinition = (
  term: string,
  people: { id: string; name: string; website_url?: string | null }[],
): { term: string; definition: ReactNode }[] => {
  if (people.length === 0) return [];

  return [
    {
      term: people.length === 1 ? term : `${term}s`,
      definition: (
        <Stack>
          {people.map((person) =>
            person.website_url ? (
              <Cell
                key={person.id}
                as="a"
                href={person.website_url}
                target="_blank"
              >
                {person.name}
              </Cell>
            ) : (
              <Cell key={person.id}>{person.name}</Cell>
            ),
          )}
        </Stack>
      ),
    },
  ];
};

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
              { term: "Dates", definition: formatExhibitionDates(exhibition) },
              ...peopleDefinition("Curator", exhibition.curators),
              ...(exhibition.artists.length > 1
                ? peopleDefinition("Artist", exhibition.artists)
                : []),
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

        {exhibition.artworks.length > 0 && (
          <Grid cellSize={["9rem", "10rem", "14rem"]}>
            {exhibition.artworks.map((artwork) => (
              <ThumbnailArtwork key={artwork.id} artwork={artwork} />
            ))}
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
