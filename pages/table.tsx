import { gql } from "urql";
import Link from "next/link";
import { Box, Cell, ClearableInput, Stack } from "@auspices/eos/client";
import { useState } from "react";
import styled from "styled-components";
import { themeGet } from "@styled-system/theme-get";
import { Table } from "../components/core/Table";
import {
  ArtworksTableQuery,
  useArtworksTableQuery,
} from "../generated/graphql";
import { Back } from "../components/core/Back";
import { Loading } from "../components/core/Loading";
import { Meta } from "../components/core/Meta";
import { Page } from "../components/core/Page";
import { buildGetStaticProps, withUrql } from "../lib/urql";

const ARTWORKS_TABLE_QUERY = gql`
  query ArtworksTableQuery {
    artworks(state: [SELECTED, PUBLISHED]) {
      id
      slug
      title
      material
      year
      duration
      dimensions {
        inches {
          to_s
        }
        centimeters {
          to_s
        }
      }
    }
  }
`;

type Artwork = ArtworksTableQuery["artworks"][number];
type SortKey = "title" | "material" | "year" | "dimensions" | "duration";
type SortDirection = "ascending" | "descending";

const columns: Array<{
  key: SortKey;
  label: string;
  align?: "left" | "center";
}> = [
  { key: "title", label: "title" },
  { key: "material", label: "material" },
  { key: "year", label: "year", align: "center" },
  { key: "dimensions", label: "dimensions" },
  { key: "duration", label: "duration" },
];

const dimensionsToString = (artwork: Artwork) => {
  if (!artwork.dimensions) return null;

  const inches = artwork.dimensions.inches.to_s;
  const centimeters = artwork.dimensions.centimeters.to_s;

  return [inches, centimeters].filter(Boolean).join(" / ") || null;
};

const sortValue = (artwork: Artwork, key: SortKey): string | number | null => {
  switch (key) {
    case "dimensions":
      return dimensionsToString(artwork);
    default:
      return artwork[key] ?? null;
  }
};

const compareArtworks = (
  left: Artwork,
  right: Artwork,
  key: SortKey,
  direction: SortDirection,
) => {
  const leftValue = sortValue(left, key);
  const rightValue = sortValue(right, key);

  if (
    (leftValue == null || leftValue === "") &&
    (rightValue == null || rightValue === "")
  ) {
    return 0;
  }
  if (leftValue == null || leftValue === "") return 1;
  if (rightValue == null || rightValue === "") return -1;

  const comparison =
    typeof leftValue === "number" && typeof rightValue === "number"
      ? leftValue - rightValue
      : String(leftValue).localeCompare(String(rightValue), undefined, {
          numeric: true,
          sensitivity: "base",
        });

  return direction === "ascending" ? comparison : -comparison;
};

const artworkMatchesFilter = (artwork: Artwork, filter: string) => {
  const query = filter.trim().toLocaleLowerCase();

  if (!query) return true;

  return columns.some((column) =>
    String(sortValue(artwork, column.key) ?? "")
      .toLocaleLowerCase()
      .includes(query),
  );
};

const SheetPage = styled(Page)`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  margin-bottom: 0;
  padding: 0;
  overflow: hidden;
`;

const SheetToolbar = styled(Stack)`
  flex: none;
`;

const TableScroller = styled(Box)`
  flex: 1;
  min-height: 0;
  margin-top: -1px;
  max-width: 100%;
  overflow: auto;
`;

const CompactTable = styled(Table)`
  min-width: 72rem;

  thead th {
    position: sticky;
    top: 0;
    z-index: 1;
    background: ${themeGet("colors.background")};
    outline: 1px solid ${themeGet("primary")};
    outline-offset: -1px;
  }

  td,
  th {
    white-space: nowrap;
  }
`;

const SortButton = styled.button`
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  color: inherit;
  background: transparent;
  font: inherit;
  text-align: inherit;
  cursor: pointer;

  &:focus-visible {
    outline: 1px solid currentColor;
    outline-offset: -1px;
  }
`;

const ArtworksTablePage = () => {
  const [{ fetching, error, data }] = useArtworksTableQuery();
  const [sort, setSort] = useState<{
    key: SortKey;
    direction: SortDirection;
  } | null>(null);
  const [filter, setFilter] = useState("");

  if (error) {
    throw error;
  }

  if (fetching || !data) {
    return <Loading />;
  }

  const { artworks } = data;
  const filteredArtworks = artworks.filter((artwork) =>
    artworkMatchesFilter(artwork, filter),
  );
  const sortedArtworks = sort
    ? [...filteredArtworks].sort((left, right) =>
        compareArtworks(left, right, sort.key, sort.direction),
      )
    : filteredArtworks;

  const handleSort = (key: SortKey) => {
    setSort((current) => ({
      key,
      direction:
        current?.key === key && current.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  return (
    <SheetPage>
      <Meta title="Damon Zucconi" />

      <SheetToolbar direction="horizontal">
        <Back variant="default" />

        <ClearableInput
          variant="default"
          flex={1}
          minWidth={0}
          onChange={setFilter}
          placeholder="Filter artworks"
          aria-label="Filter artworks"
        />
      </SheetToolbar>

      <TableScroller tabIndex={0} aria-label="Artwork table">
        <CompactTable position="relative">
          <thead>
            <tr>
              {columns.map((column) => {
                const isActive = sort?.key === column.key;
                const nextDirection =
                  isActive && sort.direction === "ascending"
                    ? "descending"
                    : "ascending";

                return (
                  <th
                    key={column.key}
                    aria-sort={isActive ? sort.direction : "none"}
                  >
                    <SortButton
                      type="button"
                      onClick={() => handleSort(column.key)}
                      aria-label={`Sort by ${column.label} ${nextDirection}`}
                    >
                      <Cell
                        as="span"
                        variant="small"
                        borderWidth={0}
                        display="block"
                        textAlign={column.align}
                      >
                        {column.label}
                        {isActive && (
                          <span aria-hidden="true">
                            {sort.direction === "ascending" ? " ↑" : " ↓"}
                          </span>
                        )}
                      </Cell>
                    </SortButton>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {sortedArtworks.map((artwork) => {
              return (
                <tr key={artwork.id}>
                  <td>
                    <Link
                      key={artwork.id}
                      href={`/artworks/${artwork.slug}`}
                      aria-label={`${artwork.title}; ${artwork.material} (${artwork.year})`}
                      passHref
                      legacyBehavior
                    >
                      <Cell
                        as="a"
                        variant="small"
                        borderWidth={0}
                        display="block"
                      >
                        {artwork.title}
                      </Cell>
                    </Link>
                  </td>

                  <td>
                    <Cell variant="small" borderWidth={0}>
                      {artwork.material ?? "—"}
                    </Cell>
                  </td>

                  <td>
                    <Cell variant="small" borderWidth={0} textAlign="center">
                      {artwork.year}
                    </Cell>
                  </td>

                  <td>
                    <Cell variant="small" borderWidth={0}>
                      {dimensionsToString(artwork) ?? "—"}
                    </Cell>
                  </td>

                  <td>
                    <Cell variant="small" borderWidth={0}>
                      {artwork.duration ?? "—"}
                    </Cell>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </CompactTable>
      </TableScroller>
    </SheetPage>
  );
};

export default withUrql(ArtworksTablePage);

export const getStaticProps = buildGetStaticProps(() => [ARTWORKS_TABLE_QUERY]);
