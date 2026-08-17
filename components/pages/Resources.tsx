import { gql } from "urql";
import { FC } from "react";
import styled from "styled-components";
import {
  Box,
  BoxProps,
  Button,
  Caret,
  Dropdown,
  PaneOption,
} from "@auspices/eos/client";
import { Resources_ArtworkFragment } from "../../generated/graphql";
import { DefinitionList } from "../core/DefinitionList";
import { formatFileSize } from "../../lib/formatFileSize";

const ResourcesDropdown = styled(Dropdown)`
  > div:last-child {
    max-width: inherit;
  }
`;

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

type ResourcesProps = BoxProps & {
  artwork: Resources_ArtworkFragment;
};

export const Resources: FC<ResourcesProps> = ({ artwork, ...rest }) => {
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
    <ResourcesDropdown
      placement="bottom-start"
      width="100%"
      label={({ open, ref, disabled, onMouseDown, onClick }) => (
        <DefinitionList
          nested
          width="100%"
          definitions={[
            {
              term: "Resources",
              definition: (
                <Button
                  ref={ref}
                  variant="small"
                  width="100%"
                  disabled={disabled}
                  onMouseDown={onMouseDown}
                  onClick={onClick}
                  type="button"
                  aria-expanded={open}
                >
                  {resources.length}{" "}
                  {resources.length === 1 ? "link" : "links"}
                  <Caret ml={3} direction={open ? "up" : "down"} />
                </Button>
              ),
            },
          ]}
        />
      )}
      {...rest}
    >
      {resources.map((resource) => (
        <PaneOption
          key={resource.id}
          as="a"
          href={resource.url}
          target="_blank"
        >
          {resource.title} {resource.size && <>({resource.size})</>}
          {resource.description && (
            <Box fontSize={0} textColor="secondary">
              {resource.description}
            </Box>
          )}
        </PaneOption>
      ))}
    </ResourcesDropdown>
  );
};
