import { useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { gql } from "urql";
import { Stack } from "@auspices/eos/client";
import { Cell, DefinitionList } from "../components/core/DefinitionList";
import { NavigationLayout } from "../components/layouts/NavigationLayout";
import { Meta } from "../components/core/Meta";
import {
  useNotFoundArtworksQuery,
  useNotFoundExhibitionsQuery,
} from "../generated/graphql";
import { withUrql } from "../lib/urql";

gql`
  query NotFoundArtworksQuery {
    artworks(state: [SELECTED, PUBLISHED]) {
      slug
      title
    }
  }
`;

gql`
  query NotFoundExhibitionsQuery {
    exhibitions(state: [SELECTED, PUBLISHED]) {
      slug
      title
    }
  }
`;

const levenshtein = (a: string, b: string) => {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 0; i < a.length; i++) {
    const current = [i + 1];

    for (let j = 0; j < b.length; j++) {
      const substitution = previous[j] + (a[i] === b[j] ? 0 : 1);
      current.push(Math.min(previous[j + 1] + 1, current[j] + 1, substitution));
    }

    previous = current;
  }

  return previous[b.length];
};

const MAX_SUGGESTIONS = 3;

const suggest = <T extends { slug: string }>(
  query: string,
  candidates: T[],
) => {
  const normalized = query.toLowerCase();
  const threshold = Math.max(2, Math.floor(normalized.length / 3));

  return candidates
    .map((candidate) => ({
      candidate,
      slug: candidate.slug.toLowerCase(),
      distance: levenshtein(normalized, candidate.slug.toLowerCase()),
    }))
    .filter(({ slug, distance }) => {
      if (distance <= threshold) return true;

      // Catch truncated or over-specified slugs that edit distance misses
      return (
        normalized.length >= 5 &&
        (slug.includes(normalized) || normalized.includes(slug))
      );
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, MAX_SUGGESTIONS)
    .map(({ candidate }) => candidate);
};

const PATH_PATTERN = /^\/(artworks|exhibitions)\/([^/]+)/;

// Malformed percent-encoding (e.g. a bare "%") throws a URIError
const safeDecodeURIComponent = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const Error404Page = () => {
  const { asPath } = useRouter();

  const requested = useMemo(() => {
    const [path] = asPath.split(/[?#]/);
    const match = path.match(PATH_PATTERN);

    if (!match) return null;

    return {
      kind: match[1] as "artworks" | "exhibitions",
      slug: safeDecodeURIComponent(match[2]),
    };
  }, [asPath]);

  const [{ data: artworksData }] = useNotFoundArtworksQuery({
    pause: requested?.kind !== "artworks",
  });

  const [{ data: exhibitionsData }] = useNotFoundExhibitionsQuery({
    pause: requested?.kind !== "exhibitions",
  });

  const suggestions = useMemo(() => {
    if (!requested) return [];

    const candidates: { slug: string; title: string }[] | undefined =
      requested.kind === "artworks"
        ? artworksData?.artworks
        : exhibitionsData?.exhibitions;

    if (!candidates) return [];

    return suggest(requested.slug, candidates).map((candidate) => ({
      ...candidate,
      href: `/${requested.kind}/${candidate.slug}`,
    }));
  }, [requested, artworksData, exhibitionsData]);

  return (
    <>
      <Meta title="Not Found" noIndex />

      <DefinitionList
        definitions={[
          { term: "Status", definition: "404" },
          { term: "Error", definition: "Not Found" },
          {
            term: "Description",
            definition:
              "The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.",
          },
          ...(suggestions.length > 0
            ? [
                {
                  term: "Did you mean?",
                  definition: (
                    <Stack>
                      {suggestions.map((suggestion) => (
                        <Cell
                          key={suggestion.slug}
                          as={Link}
                          href={suggestion.href}
                        >
                          {suggestion.title}
                        </Cell>
                      ))}
                    </Stack>
                  ),
                },
              ]
            : []),
        ]}
      />
    </>
  );
};

Error404Page.getLayout = NavigationLayout;

export default withUrql(Error404Page);
