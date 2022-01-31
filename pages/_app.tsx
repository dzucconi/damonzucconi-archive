import { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../lib/apolloClient";
import {
  Box,
  Clickable,
  GlobalStyles,
  ThemerProvider,
  useThemer,
} from "@auspices/eos";
import { FC, useEffect } from "react";
import { Loader } from "../components/core/Loader";

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
    <ThemeProvider
      theme={{
        ...theme,
        fonts: { body: "'Helvetica Neue', Helvetica, sans-serif" },
      }}
    >
      <GlobalStyles />

      <Loader />

      <Clickable
        position="fixed"
        bottom={0}
        right={0}
        p={6}
        zIndex={1}
        onClick={toggleScheme}
      >
        <Box width={10} height={10} bg="primary" borderRadius="50%" />
      </Clickable>

      {children}
    </ThemeProvider>
  );
};

export default ({ Component, pageProps }: AppProps) => {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <ThemerProvider>
        <App>
          <Component {...pageProps} />
        </App>
      </ThemerProvider>
    </ApolloProvider>
  );
};
