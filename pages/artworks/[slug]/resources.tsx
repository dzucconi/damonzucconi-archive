import { gql } from "urql";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import {
  Box,
  Button,
  Cell,
  File,
  Grid,
  HTML,
  ResponsiveImage,
  Stack,
  Tag,
} from "@auspices/eos/client";
import {
  ArtworkResourcesSlugsQuery,
  useArtworksResourcesQuery,
} from "../../../generated/graphql";
import {
  Tombstone,
  TOMBSTONE_ARTWORK_FRAGMENT,
} from "../../../components/pages/Tombstone";
import { PageLayout } from "../../../components/layouts/PageLayout";
import { Back } from "../../../components/core/Back";
import { Loading } from "../../../components/core/Loading";
import { Meta } from "../../../components/core/Meta";
import { Table } from "../../../components/core/Table";
import { DefinitionList } from "../../../components/core/DefinitionList";
import { buildGetStaticProps, client, withUrql } from "../../../lib/urql";
import { formatFileSize } from "../../../lib/formatFileSize";
import { prettifyUrl } from "../../../lib/prettifyUrl";

const ARTWORKS_RESOURCES_QUERY = gql`
  query ArtworksResourcesQuery($id: ID!) {
    artwork(id: $id) {
      ...Tombstone_artwork
      id
      slug
      title
      year
      state
      intent
      src
      created_at
      updated_at
      description(format: HTML)
      descriptionPlain: description(format: PLAIN)
      images(state: [DRAFT, SELECTED, PUBLISHED, ARCHIVED]) {
        id
        title
        state
        width
        height
        url
        placeholder: resized(width: 50, height: 50, blur: 10) {
          urls {
            src: _1x
          }
        }
        thumb: resized(width: 200, height: 200) {
          width
          height
          srcs: urls {
            _1x
            _2x
            _3x
          }
        }
      }
      productionFiles: production_files(
        state: [DRAFT, SELECTED, PUBLISHED, ARCHIVED]
      ) {
        id
        title
        description
        file_name
        file_content_type
        file_content_length
        state
        url
      }
      allLinks: links(
        kind: [DEFAULT, CANONICAL, SOURCE]
        state: [DRAFT, SELECTED, PUBLISHED, ARCHIVED]
      ) {
        id
        title
        description
        kind
        state
        url
      }
      attachments {
        id
        title
        file_name
        file_type
        state
        url
      }
      embeds {
        id
      }
    }
  }
  ${TOMBSTONE_ARTWORK_FRAGMENT}
`;

const SectionLabel = ({ children, ...rest }: { children: React.ReactNode }) => (
  <Box fontSize={0} color="secondary" {...rest}>
    {children}
  </Box>
);

type DownloadButtonProps = {
  url: string;
};

const DownloadButton: FC<DownloadButtonProps> = ({ url }) => {
  return (
    <Button
      as="a"
      variant="small"
      href={url}
      target="_blank"
      rel="noreferrer nofollow"
    >
      Download
    </Button>
  );
};

export const ArtworksResourcesPage = () => {
  const {
    query: { slug },
  } = useRouter();

  const [{ fetching, error, data }] = useArtworksResourcesQuery({
    variables: { id: `${slug}` },
  });

  if (error) {
    throw error;
  }

  if (fetching || !data) {
    return <Loading />;
  }

  const { artwork } = data;

  return (
    <>
      <Meta
        title={`${artwork.title} (${artwork.year}): Resources`}
        description={artwork.descriptionPlain ?? ""}
        noIndex
        noFollow={false}
      />

      <Stack direction="vertical" spacing={8}>
        <Stack width="fit-content" spacing={6}>
          <Stack width="fit-content">
            <Back href={`/artworks/${artwork.slug}`} />

            <Tombstone artwork={artwork} />
          </Stack>

          <DefinitionList
            maxWidth={["100%", "75%", "75%", "50%"]}
            definitions={[
              { term: "ID", definition: artwork.id },
              {
                term: "Slug",
                definition: artwork.slug,
                href: `/artworks/${artwork.slug}`,
              },
              {
                term: "State",
                definition: (
                  <Cell variant="small">
                    <Tag>{artwork.state}</Tag>
                  </Cell>
                ),
              },
              {
                term: "Intent",
                definition: (
                  <Cell variant="small">
                    <Tag>{artwork.intent}</Tag>
                  </Cell>
                ),
              },
              artwork.src
                ? {
                    term: "Source",
                    definition: artwork.src,
                    href: artwork.src,
                    target: "_blank",
                  }
                : { term: "Source", definition: null },
              { term: "Created", definition: artwork.created_at },
              { term: "Updated", definition: artwork.updated_at },
              {
                term: "Label",
                definition: "Printable label",
                href: `/artworks/${artwork.slug}/label`,
              },
              {
                term: "Counts",
                definition: [
                  // Numbers are stringified so zero counts still render
                  { term: "Images", definition: `${artwork.images.length}` },
                  {
                    term: "Production files",
                    definition: `${artwork.productionFiles.length}`,
                  },
                  { term: "Links", definition: `${artwork.allLinks.length}` },
                  {
                    term: "Attachments",
                    definition: `${artwork.attachments.length}`,
                  },
                  { term: "Embeds", definition: `${artwork.embeds.length}` },
                ],
              },
            ]}
          />
        </Stack>

        {artwork.description && (
          <Stack direction="vertical" spacing={4}>
            <SectionLabel>Description</SectionLabel>

            <HTML
              html={artwork.description}
              lineHeight={2}
              fontSize={1}
              maxWidth={["100%", "100%", "75%", "60%"]}
            />
          </Stack>
        )}

        {artwork.productionFiles.length > 0 && (
          <Stack direction="vertical" spacing={4}>
            <SectionLabel>
              Production files ({artwork.productionFiles.length})
            </SectionLabel>

            <Table>
              <thead>
                <tr>
                  <th>
                    <Cell variant="small" borderWidth={0}>
                      title
                    </Cell>
                  </th>
                  <th>
                    <Cell variant="small" borderWidth={0}>
                      file
                    </Cell>
                  </th>
                  <th>
                    <Cell variant="small" borderWidth={0}>
                      type
                    </Cell>
                  </th>
                  <th>
                    <Cell variant="small" borderWidth={0}>
                      size
                    </Cell>
                  </th>
                  <Box as="th" display={["none", "table-cell"]}>
                    <Cell variant="small" borderWidth={0}>
                      state
                    </Cell>
                  </Box>
                  <th>
                    <Cell variant="small" borderWidth={0} />
                  </th>
                </tr>
              </thead>

              <tbody>
                {artwork.productionFiles.map((file) => (
                  <tr key={file.id}>
                    <td>
                      <Cell
                        as="a"
                        href={file.url}
                        target="_blank"
                        rel="noreferrer nofollow"
                        variant="small"
                        borderWidth={0}
                        display="block"
                      >
                        {file.title}
                        {file.description && (
                          <Box as="span" color="secondary">
                            {" "}
                            — {file.description}
                          </Box>
                        )}
                      </Cell>
                    </td>
                    <td>
                      <Cell
                        as="a"
                        href={file.url}
                        target="_blank"
                        rel="noreferrer nofollow"
                        variant="small"
                        borderWidth={0}
                        display="block"
                        style={{ overflowWrap: "anywhere" }}
                      >
                        {file.file_name}
                      </Cell>
                    </td>
                    <td>
                      <Cell variant="small" borderWidth={0}>
                        {file.file_content_type ?? "—"}
                      </Cell>
                    </td>
                    <td>
                      <Cell variant="small" borderWidth={0}>
                        {formatFileSize(file.file_content_length)}
                      </Cell>
                    </td>
                    <Box as="td" display={["none", "table-cell"]}>
                      <Cell variant="small" borderWidth={0}>
                        <Tag>{file.state}</Tag>
                      </Cell>
                    </Box>
                    <td>
                      <Cell variant="small" borderWidth={0}>
                        <DownloadButton url={file.url} />
                      </Cell>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Stack>
        )}

        {artwork.allLinks.length > 0 && (
          <Stack direction="vertical" spacing={4}>
            <SectionLabel>Links ({artwork.allLinks.length})</SectionLabel>

            <Table>
              <thead>
                <tr>
                  <th>
                    <Cell variant="small" borderWidth={0}>
                      title
                    </Cell>
                  </th>
                  <th>
                    <Cell variant="small" borderWidth={0}>
                      url
                    </Cell>
                  </th>
                  <th>
                    <Cell variant="small" borderWidth={0}>
                      kind
                    </Cell>
                  </th>
                  <Box as="th" display={["none", "table-cell"]}>
                    <Cell variant="small" borderWidth={0}>
                      state
                    </Cell>
                  </Box>
                </tr>
              </thead>

              <tbody>
                {artwork.allLinks.map((link) => (
                  <tr key={link.id}>
                    <td>
                      <Cell variant="small" borderWidth={0}>
                        {link.title}
                        {link.description && (
                          <Box as="span" color="secondary">
                            {" "}
                            — {link.description}
                          </Box>
                        )}
                      </Cell>
                    </td>
                    <td>
                      <Cell
                        as="a"
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        variant="small"
                        borderWidth={0}
                        display="block"
                        style={{ overflowWrap: "anywhere" }}
                      >
                        {prettifyUrl(link.url)}
                      </Cell>
                    </td>
                    <td>
                      <Cell variant="small" borderWidth={0}>
                        <Tag>{link.kind}</Tag>
                      </Cell>
                    </td>
                    <Box as="td" display={["none", "table-cell"]}>
                      <Cell variant="small" borderWidth={0}>
                        <Tag>{link.state}</Tag>
                      </Cell>
                    </Box>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Stack>
        )}

        {artwork.attachments.length > 0 && (
          <Stack direction="vertical" spacing={4}>
            <SectionLabel>
              Attachments ({artwork.attachments.length})
            </SectionLabel>

            <Table>
              <thead>
                <tr>
                  <th>
                    <Cell variant="small" borderWidth={0}>
                      title
                    </Cell>
                  </th>
                  <th>
                    <Cell variant="small" borderWidth={0}>
                      file
                    </Cell>
                  </th>
                  <th>
                    <Cell variant="small" borderWidth={0}>
                      type
                    </Cell>
                  </th>
                  <Box as="th" display={["none", "table-cell"]}>
                    <Cell variant="small" borderWidth={0}>
                      state
                    </Cell>
                  </Box>
                </tr>
              </thead>

              <tbody>
                {artwork.attachments.map((attachment) => (
                  <tr key={attachment.id}>
                    <td>
                      <Cell
                        as="a"
                        href={attachment.url}
                        target="_blank"
                        rel="noreferrer"
                        variant="small"
                        borderWidth={0}
                        display="block"
                      >
                        {attachment.title ?? attachment.file_name}
                      </Cell>
                    </td>
                    <td>
                      <Cell variant="small" borderWidth={0}>
                        {attachment.file_name}
                      </Cell>
                    </td>
                    <td>
                      <Cell variant="small" borderWidth={0}>
                        {attachment.file_type}
                      </Cell>
                    </td>
                    <Box as="td" display={["none", "table-cell"]}>
                      <Cell variant="small" borderWidth={0}>
                        <Tag>{attachment.state}</Tag>
                      </Cell>
                    </Box>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Stack>
        )}

        {artwork.images.length > 0 && (
          <Stack direction="vertical" spacing={4}>
            <SectionLabel>Images ({artwork.images.length})</SectionLabel>

            <Box>
              <Grid cellSize={["9rem", "10rem", "14rem"]}>
                {artwork.images.map((image) => (
                  <Box
                    key={image.id}
                    as="a"
                    href={image.url}
                    target="_blank"
                    rel="noreferrer"
                    display="block"
                    width="100%"
                    style={{ textDecoration: "none" }}
                  >
                    <File
                      position="static"
                      name={image.title || "Untitled"}
                      meta={[
                        `${image.width}×${image.height}`,
                        image.state,
                      ].join(" · ")}
                    >
                      <ResponsiveImage
                        placeholder={image.placeholder.urls.src}
                        srcs={[
                          image.thumb.srcs._1x,
                          image.thumb.srcs._2x,
                          image.thumb.srcs._3x,
                        ]}
                        aspectWidth={image.thumb.width}
                        aspectHeight={image.thumb.height}
                        maxWidth={image.thumb.width}
                        maxHeight={image.thumb.height}
                        alt={image.title ?? ""}
                        loading="lazy"
                      />
                    </File>
                  </Box>
                ))}
              </Grid>
            </Box>
          </Stack>
        )}
      </Stack>
    </>
  );
};

ArtworksResourcesPage.getLayout = PageLayout;

export default withUrql(ArtworksResourcesPage);

export const getStaticProps = buildGetStaticProps((ctx) => [
  ARTWORKS_RESOURCES_QUERY,
  { id: ctx.params?.slug },
]);

const ARTWORK_RESOURCES_SLUGS_QUERY = gql`
  query ArtworkResourcesSlugsQuery {
    artworks {
      slug
    }
  }
`;

export const getStaticPaths = async () => {
  const { data } = await client
    .query<ArtworkResourcesSlugsQuery>(ARTWORK_RESOURCES_SLUGS_QUERY, {})
    .toPromise();

  const paths = (data?.artworks ?? []).flatMap(({ slug }) => {
    if (typeof slug !== "string" || slug.length === 0) {
      return [];
    }

    return [{ params: { slug } }];
  });

  return { paths, fallback: "blocking" };
};
