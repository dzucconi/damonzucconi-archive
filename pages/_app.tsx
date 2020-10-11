import { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "../components/core/GlobalStyles";
import { THEME } from "../tokens/theme";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={THEME}>
      <GlobalStyles />

      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default App;
