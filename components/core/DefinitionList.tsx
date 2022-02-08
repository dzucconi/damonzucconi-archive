import { Box, BoxProps, Cell as _Cell, Stack } from "@auspices/eos";
import Link from "next/link";
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

          const isNested = typeof definition === "object";
          const isExternal = href && href.startsWith("http");
          const isInternal = href && href.startsWith("/");

          return (
            <Stack direction="horizontal" key={index}>
              <Cell as="dt">{term}</Cell>

              <Box as="dd" flex="1">
                {(() => {
                  if (isNested) {
                    return (
                      <DefinitionList
                        nested
                        width="100%"
                        definitions={definition}
                      />
                    );
                  }

                  if (isExternal) {
                    return (
                      <Cell as="a" href={href} {...link}>
                        {definition}
                      </Cell>
                    );
                  }

                  if (isInternal) {
                    return (
                      <Link href={href} passHref>
                        <Cell as="a">{definition}</Cell>
                      </Link>
                    );
                  }

                  return <Cell>{definition}</Cell>;
                })()}
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
