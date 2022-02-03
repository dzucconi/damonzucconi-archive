import { Box, BoxProps, Cell as _Cell, Stack, StackProps } from "@auspices/eos";
import { FC } from "react";
import styled from "styled-components";

type Definition = {
  term: string;
  definition?: string | number | null | Definition[];
};

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
        {definitions.map(({ term, definition }, index) => {
          if (!definition) return null;

          return (
            <Stack direction="horizontal" key={index}>
              <Cell as="dt">{term}</Cell>

              {typeof definition === "object" ? (
                <Cell as="dd" flex="1" px={0} py={0} borderWidth={0}>
                  <DefinitionList
                    nested
                    width="100%"
                    definitions={definition}
                  />
                </Cell>
              ) : (
                <Cell as="dd" flex="1">
                  {definition}
                </Cell>
              )}
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};

const Cell = styled(_Cell)``;

Cell.defaultProps = {
  fontSize: 1,
  px: 3,
  py: 2,
};
