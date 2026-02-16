import { gql } from "urql";
import { useRouter } from "next/router";
import { Box, Stack, HTML, Grid } from "@auspices/eos/client";
import { TagSlugsQuery, useTagShowQuery } from "../../generated/graphql";
import { PageLayout } from "../../components/layouts/PageLayout";
import { Loading } from "../../components/core/Loading";
import { Meta } from "../../components/core/Meta";
import { buildGetStaticProps, client, withUrql } from "../../lib/urql";
import {
  THUMBNAIL_ARTWORK_FRAGMENT,
  ThumbnailArtwork,
} from "../../components/pages/ThumbnailArtwork";
import { DefinitionList } from "../../components/core/DefinitionList";

const TAG_SHOW_QUERY = gql`
  query TagShowQuery($id: ID!) {
    tag(id: $id) {
      id
      slug
      description(format: HTML)
      title
      display_prices
      artworks {
        id
        ...ThumbnailArtwork_artwork
      }
    }
  }
  ${THUMBNAIL_ARTWORK_FRAGMENT}
`;

export const TagShowPage = () => {
  const {
    query: { slug },
  } = useRouter();

  const [{ fetching, error, data }] = useTagShowQuery({
    variables: { id: `${slug}` },
  });

  if (error) {
    throw error;
  }

  if (fetching || !data) {
    return <Loading />;
  }

  const { tag } = data;
  const { artworks } = tag;

  return (
    <>
      <Meta title={`${tag.title}`} />

      <Stack direction="vertical" spacing={8}>
        <Stack width="fit-content">
          <DefinitionList
            definitions={[{ term: "Title", definition: tag.title }]}
          />
        </Stack>

        {tag.description && (
          <Box>
            <HTML
              mx="auto"
              lineHeight={2}
              fontSize={3}
              maxWidth={["100%", "100%", "75%", "60%"]}
              html={tag.description}
            />
          </Box>
        )}

        <Stack spacing={6}>
          <Grid cellSize={["9rem", "10rem", "14rem"]}>
            {artworks.map((artwork) => {
              return (
                <ThumbnailArtwork
                  key={artwork.id}
                  artwork={artwork}
                  displayPrice={tag.display_prices}
                />
              );
            })}
          </Grid>
        </Stack>
      </Stack>
    </>
  );
};

TagShowPage.getLayout = PageLayout;

export default withUrql(TagShowPage);

export const getStaticProps = buildGetStaticProps((ctx) => [
  TAG_SHOW_QUERY,
  { id: ctx.params?.slug },
]);

const TAG_SLUGS_QUERY = gql`
  query TagSlugsQuery {
    tags {
      slug
    }
  }
`;

export const getStaticPaths = async () => {
  const { data } = await client
    .query<TagSlugsQuery>(TAG_SLUGS_QUERY, {})
    .toPromise();

  const paths = (data?.tags ?? []).flatMap(({ slug }) => {
    if (typeof slug !== "string" || slug.length === 0) {
      return [];
    }

    return [{ params: { slug } }];
  });

  return { paths, fallback: "blocking" };
};
