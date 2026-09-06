import { gql } from "urql";
import { useMemo } from "react";
import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";
import {
  ExhibitionKind,
  State,
  useExhibitionsIndexQuery,
} from "../generated/graphql";
import {
  EmptyFrame,
  File,
  Grid,
  ResponsiveImage,
  Stack,
} from "@auspices/eos/client";
import Link from "next/link";
import { NavigationLayout } from "../components/layouts/NavigationLayout";
import { Loading } from "../components/core/Loading";
import { Meta } from "../components/core/Meta";
import { buildGetStaticProps, withUrql } from "../lib/urql";

const DEFAULT_STATE = [State.Selected, State.Published];
const DEFAULT_KIND = ExhibitionKind.Solo;

const STATE_VALUES = new Set<string>(Object.values(State));
const KIND_VALUES = new Set<string>(Object.values(ExhibitionKind));

const splitQueryValues = (value: string | string[] | undefined) => {
  if (value === undefined) return [];

  return (Array.isArray(value) ? value : [value]).flatMap((part) =>
    part
      .split(",")
      .map((item) => item.trim().toUpperCase())
      .filter(Boolean),
  );
};

const parseExhibitionFilters = (query: ParsedUrlQuery) => {
  const states = splitQueryValues(query.state).filter((value): value is State =>
    STATE_VALUES.has(value),
  );
  const [kind] = splitQueryValues(query.kind);
  const parsedKind = KIND_VALUES.has(kind)
    ? (kind as ExhibitionKind)
    : undefined;
  const hasFilterParams =
    query.state !== undefined || query.kind !== undefined;

  if (!hasFilterParams) {
    return { state: DEFAULT_STATE, kind: DEFAULT_KIND };
  }

  return {
    state: states.length > 0 ? states : DEFAULT_STATE,
    kind: parsedKind,
  };
};

const EXHIBITIONS_INDEX_QUERY = gql`
  query ExhibitionsIndexQuery($state: [State], $kind: ExhibitionKind) {
    exhibitions(state: $state, kind: $kind) {
      id
      slug
      title
      city
      year
      images(limit: 1, state: PUBLISHED) {
        placeholder: resized(width: 50, height: 50, blur: 10) {
          urls {
            src: _1x
          }
        }
        resized(width: 200, height: 200) {
          width
          height
          urls {
            _1x
            _2x
            _3x
          }
        }
      }
    }
  }
`;

const ExhibitionsIndexPage = () => {
  const router = useRouter();
  const variables = useMemo(
    () =>
      router.isReady
        ? parseExhibitionFilters(router.query)
        : { state: DEFAULT_STATE, kind: DEFAULT_KIND },
    [router.isReady, router.query],
  );

  const [{ fetching, error, data }] = useExhibitionsIndexQuery({
    variables,
  });

  if (error) {
    throw error;
  }

  if (fetching || !data) {
    return <Loading />;
  }

  const { exhibitions } = data;

  return (
    <>
      <Meta title="Exhibitions" />

      <Stack spacing={6}>
        <Grid cellSize={["9rem", "10rem", "14rem"]}>
          {exhibitions.map((exhibition) => {
            const [image] = exhibition.images;

            return (
              <Link
                key={exhibition.id}
                href={`/exhibitions/${exhibition.slug}`}
                aria-label={`${exhibition.title}, ${exhibition.city}; (${exhibition.year})`}
                passHref
                legacyBehavior
              >
                <File
                  name={[exhibition.title, exhibition.city].join(", ")}
                  meta={`${exhibition.year}`}
                  selected
                  // @ts-ignore
                  as="a"
                >
                  {image ? (
                    <ResponsiveImage
                      placeholder={image.placeholder.urls.src}
                      srcs={[
                        image.resized.urls._1x,
                        image.resized.urls._2x,
                        image.resized.urls._3x,
                      ]}
                      aspectWidth={image.resized.width}
                      aspectHeight={image.resized.height}
                      maxWidth={image.resized.width}
                      maxHeight={image.resized.height}
                      // TODO: Should be non-nullable
                      alt={exhibition.title!}
                      loading="lazy"
                    />
                  ) : (
                    <EmptyFrame
                      width="100%"
                      height="100%"
                      color="hint"
                      border="1px solid"
                      borderColor="hint"
                    />
                  )}
                </File>
              </Link>
            );
          })}
        </Grid>
      </Stack>
    </>
  );
};

ExhibitionsIndexPage.getLayout = NavigationLayout;

export default withUrql(ExhibitionsIndexPage);

export const getStaticProps = buildGetStaticProps(() => [
  EXHIBITIONS_INDEX_QUERY,
  { state: DEFAULT_STATE, kind: DEFAULT_KIND },
]);
