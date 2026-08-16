import { gql } from "urql";
import { FC } from "react";
import { Box } from "@auspices/eos/client";
import { Resources_ArtworkFragment } from "../../generated/graphql";
import { Disclosure } from "../core/Disclosure";
import { formatFileSize } from "../../lib/formatFileSize";

export const RESOURCES_ARTWORK_FRAGMENT = gql`
  fragment Resources_artwork on Artwork {
    productionFiles: production_files(state: PUBLISHED) {
      id
      title
      description
      file_content_length
      url
    }
    sourceLinks: links(kind: SOURCE, state: PUBLISHED) {
      id
      title
      description
      url
    }
  }
`;

type ResourcesProps = {
  artwork: Resources_ArtworkFragment;
};

export const Resources: FC<ResourcesProps> = ({ artwork }) => {
  const resources = [
    ...artwork.productionFiles.map((file) => ({
      id: `production:${file.id}`,
      title: file.title,
      description: file.description,
      size: formatFileSize(file.file_content_length),
      url: file.url,
    })),
    ...artwork.sourceLinks.map((link) => ({
      id: `source:${link.id}`,
      title: link.title,
      description: link.description,
      size: null,
      url: link.url,
    })),
  ];

  if (resources.length === 0) {
    return null;
  }

  return (
    <Disclosure
      label="Resources"
      width="fit-content"
      maxWidth="100%"
      textColor="secondary"
    >
      {resources.map((resource) => (
        <Box key={resource.id} fontSize={0}>
          <Box as="a" href={resource.url} target="_blank" textColor="primary">
            {resource.title} {resource.size && <>({resource.size})</>}
          </Box>

          {resource.description && (
            <Box textColor="secondary">{resource.description}</Box>
          )}
        </Box>
      ))}
    </Disclosure>
  );
};
