import { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../lib/apolloClient";
import {
  Box,
  Clickable,
  GlobalStyles,
  ThemerProvider,
  Tooltip,
  useThemer,
} from "@auspices/eos";
import { FC, ReactElement, useEffect, ReactNode } from "react";
import { Loader } from "../components/core/Loader";
import { NextPage } from "next";
import Head from "next/head";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

const App: FC = ({ children }) => {
  const { theme, toggleScheme } = useThemer();

  useEffect(() => {
    // HACK: Toggle the scheme back and forth on initial load
    // to prevent rendering mismatch
    const timeout = setTimeout(() => {
      toggleScheme();
      toggleScheme();
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
      </Head>

      <ThemeProvider
        theme={{
          ...theme,
          fonts: {
            ...theme.fonts,
            body: "'Helvetica Neue', Helvetica, sans-serif",
            system:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
          },
        }}
      >
        <GlobalStyles />

        <Loader />

        {children}

        <Tooltip label="Invert color scheme" placement="left">
          <Clickable
            position="fixed"
            bottom={0}
            right={0}
            p={6}
            zIndex={1}
            onClick={toggleScheme}
            cursor="pointer"
          >
            <Box width={10} height={10} bg="primary" borderRadius="50%" />
          </Clickable>
        </Tooltip>
      </ThemeProvider>
    </>
  );
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default ({ Component, pageProps }: AppPropsWithLayout) => {
  const apolloClient = useApollo(pageProps.initialApolloState);

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ApolloProvider client={apolloClient}>
      <ThemerProvider>
        <App>{getLayout(<Component {...pageProps} />)}</App>
      </ThemerProvider>
    </ApolloProvider>
  );
};
