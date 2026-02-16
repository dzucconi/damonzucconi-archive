import { Grid, Stack } from "@auspices/eos/client";
import { State, useTagsIndexQuery } from "../../generated/graphql";
import { NavigationLayout } from "../../components/layouts/NavigationLayout";
import { Loading } from "../../components/core/Loading";
import { Meta } from "../../components/core/Meta";
import { buildGetStaticProps, withUrql } from "../../lib/urql";
import { gql } from "urql";
import Link from "next/link";

export const TAGS_INDEX_QUERY = gql`
  query TagsIndexQuery($state: [State]) {
    tags(state: $state, visibility: PUBLIC) {
      id
      title
      slug
    }
  }
`;

const TagsIndexPage = () => {
  const [{ fetching, error, data }] = useTagsIndexQuery({
    variables: { state: [State.Selected, State.Published] },
  });

  if (error) {
    throw error;
  }

  if (fetching || !data) {
    return <Loading />;
  }

  const { tags } = data;

  return (
    <>
      <Meta title="Damon Zucconi" />

      <Stack spacing={6}>
        <Grid cellSize={["9rem", "10rem", "14rem"]}>
          {tags.map((tag) => {
            return (
              <Link key={tag.id} href={`/tags/${tag.slug}`}>
                {tag.title}
              </Link>
            );
          })}
        </Grid>
      </Stack>
    </>
  );
};

TagsIndexPage.getLayout = NavigationLayout;

export default withUrql(TagsIndexPage);

export const getStaticProps = buildGetStaticProps(() => [
  TAGS_INDEX_QUERY,
  { state: [State.Selected, State.Published] },
]);
