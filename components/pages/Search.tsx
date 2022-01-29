import { gql } from "@apollo/client";
import {
  Box,
  Button,
  ClearableInput,
  ClearableInputProps,
  Stack,
} from "@auspices/eos";
import { FC, useEffect, useRef, useState } from "react";
import { useSearchQuery } from "../../generated/graphql";
import Link from "next/link";
import { useKeyboardListNavigation } from "use-keyboard-list-navigation";
import { useRouter } from "next/router";

// TODO
// - Highlight search results

gql`
  query SearchQuery {
    artworks(state: [SELECTED, PUBLISHED]) {
      id
      slug
      title
    }
  }
`;

export const Search: FC<ClearableInputProps> = (props) => {
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
    !loading && data && query !== "" && query.length > 1
      ? data.artworks.filter((artwork) => {
          return artwork.title.toLowerCase().includes(query.toLowerCase());
        })
      : [];

  const router = useRouter();

  const { index } = useKeyboardListNavigation({
    list: filtered,
    onEnter: () => {
      router.push(`/artworks/${filtered[index].slug}`);
    },
  });

  if (error) {
    throw error;
  }

  return (
    <Stack width={["100%", "85%", "75%", "60%"]} mx="auto">
      <ClearableInput
        ref={ref}
        placeholder="Search"
        onChange={setQuery}
        {...props}
      />
      <Box position="relative" zIndex={1}>
        {filtered.length > 0 && (
          <Stack position="absolute" top={0} left={0} right={0}>
            {filtered.slice(0, 5).map((artwork, i) => {
              return (
                <Box key={artwork.id}>
                  <Link href={`/artworks/${artwork.slug}`} passHref>
                    <Button as="a" width="100%" highlighted={index === i}>
                      {artwork.title}
                    </Button>
                  </Link>
                </Box>
              );
            })}
          </Stack>
        )}
      </Box>
    </Stack>
  );
};
