import { FC } from "react";
import { Stack, StackProps, Button } from "@auspices/eos";
import { useRouter } from "next/router";
import Link from "next/link";
import { Search } from "./Search";

type NavigationProps = StackProps & {
  loading?: boolean;
};

export const Navigation: FC<NavigationProps> = ({ loading, ...rest }) => {
  return (
    <Stack {...rest}>
      <Stack
        direction={["vertical", "vertical", "horizontal"]}
        justifyContent="center"
        textAlign="center"
        width="100%"
      >
        <NavigationItem href="/">Not Everything</NavigationItem>

        <NavigationItem href="/artworks">Mostly Everything</NavigationItem>

        <NavigationItem href="/websites">Only Websites</NavigationItem>

        <NavigationItem href="/information">Information</NavigationItem>
      </Stack>

      <Search loading={loading} />
    </Stack>
  );
};

type NavigationItemProps = {
  href: string;
};

const NavigationItem: FC<NavigationItemProps> = ({
  href,
  children,
  ...rest
}) => {
  const router = useRouter();

  return (
    <Link href={href} passHref>
      <Button
        fontSize={1}
        px={3}
        py={2}
        flex={1}
        as="a"
        disabled={router.asPath === href}
        {...rest}
      >
        {children}
      </Button>
    </Link>
  );
};
