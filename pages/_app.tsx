import { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { GlobalStyles, ThemerProvider, useThemer } from "@auspices/eos/client";
import { Scheme } from "@auspices/eos/theme";
import { ReactElement, ReactNode, useEffect, useMemo, useState } from "react";
import { Loader } from "../components/core/Loader";
import { NextPage } from "next";
import Head from "next/head";
import { UrqlProvider } from "../lib/urql";
import { Analytics } from "../components/pages/Analytics";
import { HistoryProvider } from "../lib/useHistory";
import { SSRData } from "urql";
import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
} from "next-themes";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPageProps = AppProps["pageProps"] & {
  urqlState?: SSRData;
};

const getSchemeFromDom = (): Scheme => {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
};

const EosStyledThemeProvider = ({ children }: { children: ReactNode }) => {
  const { theme } = useThemer();

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
};

const EosThemeBridge = ({ children }: { children: ReactNode }) => {
  const { resolvedTheme, setTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);
  const [fallbackScheme] = useState<Scheme>(getSchemeFromDom);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scheme = useMemo<Scheme>(() => {
    if (resolvedTheme === "dark" || resolvedTheme === "light") {
      return resolvedTheme;
    }
    return fallbackScheme;
  }, [fallbackScheme, resolvedTheme]);

  if (!mounted) return null;

  return (
    <ThemerProvider scheme={scheme} setScheme={(nextScheme) => setTheme(nextScheme)}>
      <EosStyledThemeProvider>{children}</EosStyledThemeProvider>
    </ThemerProvider>
  );
};

const AppShell = ({ children }: { children: ReactNode }) => {

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
      </Head>

      <HistoryProvider>
        <EosThemeBridge>
          <Loader />

          {children}
        </EosThemeBridge>
      </HistoryProvider>

      <Analytics />
    </>
  );
};

type AppPropsWithLayout = Omit<AppProps, "Component" | "pageProps"> & {
  Component: NextPageWithLayout;
  pageProps: AppPageProps;
};

const Provided = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  const { urqlState, ...componentPageProps } = pageProps;

  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="system" enableSystem>
      <UrqlProvider urqlState={urqlState}>
        <AppShell>{getLayout(<Component {...componentPageProps} />)}</AppShell>
      </UrqlProvider>
    </NextThemesProvider>
  );
};

export default Provided;
