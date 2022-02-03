import { FC, useState } from "react";
import { Stack, StackProps, Button, Box } from "@auspices/eos";
import { useRouter } from "next/router";
import Link from "next/link";
import { Search } from "./Search";
import { useApolloNetworkStatus } from "../../lib/apolloClient";

const ITEMS = [
  { label: "Not Everything", href: "/" },
  { label: "Mostly Everything", href: "/artworks" },
  { label: "Only Websites", href: "/websites" },
  { label: "Information", href: "/information" },
  { label: "Exhibitions", href: "/exhibitions" },
];

type NavigationProps = StackProps;

export const Navigation: FC<NavigationProps> = ({ ...rest }) => {
  const router = useRouter();

  const status = useApolloNetworkStatus();

  const [key, setKey] = useState(Math.random());

  // HACK: Prevent focus ring from remaining after disabling
  const handleClick = () => {
    setKey(Math.random());
  };

  return (
    <Stack key={key} width={["100%", "100%", "fit-content"]} {...rest}>
      <Stack direction={["vertical", "vertical", "horizontal"]}>
        {ITEMS.map(({ label, href }) => {
          return (
            <Box key={href}>
              <Link key={href} href={href} passHref>
                <Button
                  fontSize={1}
                  px={3}
                  py={2}
                  as="a"
                  width="100%"
                  disabled={router.asPath === href}
                  onClick={handleClick}
                >
                  {label}
                </Button>
              </Link>
            </Box>
          );
        })}
      </Stack>

      <Search width="100%" loading={status.numPendingQueries > 0} />
    </Stack>
  );
};
