import { Box, BoxProps, Cell as _Cell, Stack, StackProps } from "@auspices/eos";
import { AnchorHTMLAttributes, FC } from "react";
import styled from "styled-components";

type Definition = {
  term: string;
  definition?: string | number | null | Definition[];
} & AnchorHTMLAttributes<HTMLAnchorElement>;

type DefinitionListProps = BoxProps & {
  definitions: Definition[];
  nested?: boolean;
};

export const DefinitionList: FC<DefinitionListProps> = ({
  definitions,
  nested,
  ...rest
}) => {
  return (
    <Box as="dl" {...rest}>
      <Stack width={nested ? undefined : "fit-content"}>
        {definitions.map(({ term, definition, href, ...link }, index) => {
          if (!definition) return null;

          return (
            <Stack direction="horizontal" key={index}>
              <Cell as="dt">{term}</Cell>

              <Box as="dd" flex="1">
                {typeof definition === "object" ? (
                  <DefinitionList
                    nested
                    width="100%"
                    definitions={definition}
                  />
                ) : (
                  <Cell {...(href ? { as: "a", href, ...link } : {})}>
                    {definition}
                  </Cell>
                )}
              </Box>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};

export const Cell = styled(_Cell)``;

Cell.defaultProps = {
  fontSize: 1,
  px: 3,
  py: 2,
};
