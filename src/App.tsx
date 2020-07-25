import React from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyles, useThemer } from "@auspices/eos";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ArtworksPage } from "./pages/ArtworksPage";
import { ArtworkPage } from "./pages/ArtworkPage";

export const App: React.FC = () => {
  const { theme } = useThemer();
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Switch>
          <Route path="/" exact>
            <ArtworksPage />
          </Route>

          <Route path="/artworks/:id" exact>
            <ArtworkPage />
          </Route>
        </Switch>
      </ThemeProvider>
    </Router>
  );
};
