import { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { GlobalStyles, ThemerProvider, useThemer } from "@auspices/eos";
import { FC, ReactElement, ReactNode } from "react";
import { Loader } from "../components/core/Loader";
import { NextPage } from "next";
import Head from "next/head";
import { UrqlProvider } from "../lib/urql";
import { Analytics } from "../components/pages/Analytics";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

const App: FC = ({ children }) => {
  const { theme } = useThemer();

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
      </Head>

      <ThemeProvider theme={theme}>
        <GlobalStyles />

        <Loader />

        {children}
      </ThemeProvider>

      <Analytics />
    </>
  );
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const Provided = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <UrqlProvider>
      <ThemerProvider>
        <App>{getLayout(<Component {...pageProps} />)}</App>
      </ThemerProvider>
    </UrqlProvider>
  );
};

export default Provided;
