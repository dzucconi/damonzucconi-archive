import { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { GlobalStyles, ThemerProvider, useThemer } from "@auspices/eos/client";
import { ReactElement, ReactNode } from "react";
import { Loader } from "../components/core/Loader";
import { NextPage } from "next";
import Head from "next/head";
import { UrqlProvider } from "../lib/urql";
import { Analytics } from "../components/pages/Analytics";
import { HistoryProvider } from "../lib/useHistory";
import { SSRData } from "urql";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPageProps = AppProps["pageProps"] & {
  urqlState?: SSRData;
};

const App = ({ children }: { children: ReactNode }) => {
  const { theme } = useThemer();

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
      </Head>

      <HistoryProvider>
        <ThemeProvider theme={theme}>
          <GlobalStyles />

          <Loader />

          {children}
        </ThemeProvider>
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
    <UrqlProvider urqlState={urqlState}>
      <ThemerProvider>
        <App>{getLayout(<Component {...componentPageProps} />)}</App>
      </ThemerProvider>
    </UrqlProvider>
  );
};

export default Provided;
