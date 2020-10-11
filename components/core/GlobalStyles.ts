import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { ROOT_FONT_SIZE, THEME } from "../../tokens/theme";

export const GlobalStyles = createGlobalStyle`
  ${reset}

  html {
    box-sizing: border-box;
    font-size: ${ROOT_FONT_SIZE};
  }

  *,
  *:after,
  *:before {
    box-sizing: inherit;
  }

  body {
    color: ${THEME.colors.primary};
    background-color: ${THEME.colors.background};
    font-family: ${THEME.fonts.body};
    -webkit-text-size-adjust: 100%;
  }

  body,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  ol,
  ul {
    margin: 0;
    padding: 0;
    font-weight: normal;
  }

  button {
    margin: 0;
  }

  ol,
  ul {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  body,
  input {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    text-decoration: none;
  }
`;
