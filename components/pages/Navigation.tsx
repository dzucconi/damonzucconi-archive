import { FC } from "react";
import { Stack, StackProps, Button, Box } from "@auspices/eos";
import { useRouter } from "next/router";
import Link from "next/link";
import { Search } from "./Search";

const ITEMS = [
  { label: "Not Everything", href: "/" },
  { label: "Mostly Everything", href: "/artworks" },
  { label: "Only Websites", href: "/websites" },
  { label: "Exhibitions", href: "/exhibitions" },
  { label: "Information", href: "/information" },
];

type NavigationProps = StackProps;

export const Navigation: FC<NavigationProps> = ({ ...rest }) => {
  const router = useRouter();

  return (
    <Stack width={["100%", "100%", "fit-content"]} {...rest}>
      <Stack direction={["vertical", "vertical", "horizontal"]}>
        {ITEMS.map(({ label, href }) => {
          return (
            <Box key={href}>
              <Link key={href} href={href} passHref legacyBehavior>
                <Button
                  as="a"
                  variant="small"
                  width="100%"
                  textDecoration={router.asPath === href ? "underline" : "none"}
                >
                  {label}
                </Button>
              </Link>
            </Box>
          );
        })}
      </Stack>

      <Search width="100%" />
    </Stack>
  );
};
