import { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../lib/apolloClient";
import { GlobalStyles, SCHEMES, useThemer } from "@auspices/eos";

const App = ({ Component, pageProps }: AppProps) => {
  const apolloClient = useApollo(pageProps.initialApolloState);
  const { theme } = useThemer();

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider
        theme={{
          ...theme,
          colors: SCHEMES["dark"],
          fonts: { body: "'Helvetica Neue', Helvetica, sans-serif" },
        }}
      >
        <GlobalStyles />

        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
