import { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../lib/apolloClient";
import { THEME, GlobalStyles } from "@auspices/eos";

const App = ({ Component, pageProps }: AppProps) => {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={{ ...THEME, rootFontSize: "15px" }}>
        <GlobalStyles />

        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
