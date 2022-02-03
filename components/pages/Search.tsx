import { gql } from "@apollo/client";
import {
  Box,
  Button,
  ClearableInput,
  ClearableInputProps,
  Loading,
  Stack,
} from "@auspices/eos";
import { FC, useEffect, useRef, useState } from "react";
import { useSearchQuery } from "../../generated/graphql";
import Link from "next/link";
import { useKeyboardListNavigation } from "use-keyboard-list-navigation";
import { useRouter } from "next/router";

gql`
  query SearchQuery {
    artworks(state: [SELECTED, PUBLISHED]) {
      id
      slug
      title
    }
  }
`;

type SearchProps = ClearableInputProps & {
  loading?: boolean;
};

export const Search: FC<SearchProps> = ({
  loading: _loading = false,
  ...rest
}) => {
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!ref.current) return;

      if (document.activeElement === ref.current) return;

      if (event.key === "/") {
        event.preventDefault();
        ref.current.focus();
      }
    };

    document.addEventListener("keypress", handleKeyDown);

    return () => {
      document.removeEventListener("keypress", handleKeyDown);
    };
  }, []);

  const [query, setQuery] = useState("");

  const { loading, error, data } = useSearchQuery();

  const filtered =
    !loading && data && query !== ""
      ? data.artworks.filter((artwork) => {
          return artwork.title.toLowerCase().includes(query.toLowerCase());
        })
      : [];

  const router = useRouter();

  const { index } = useKeyboardListNavigation({
    list: filtered,
    onEnter: ({ element }) => {
      if (!element) return;
      router.push(`/artworks/${element.slug}`);
    },
  });

  if (error) {
    throw error;
  }

  return (
    <Box position="relative">
      <Loading px={0} py={0} borderWidth={0} loading={_loading}>
        <ClearableInput
          ref={ref}
          placeholder={_loading ? "Loading" : "Search"}
          onChange={setQuery}
          flex={1}
          {...rest}
        />
      </Loading>

      {filtered.length > 0 && (
        <Stack
          position="absolute"
          top="100%"
          marginTop="-1px"
          left={0}
          right={0}
          zIndex={2}
        >
          {filtered.slice(0, 5).map((artwork, i) => {
            return (
              <Box key={artwork.id}>
                <Link href={`/artworks/${artwork.slug}`} passHref>
                  <Button
                    as="a"
                    width="100%"
                    highlighted={index === i}
                    justifyContent="flex-start"
                  >
                    {artwork.title}
                  </Button>
                </Link>
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};
