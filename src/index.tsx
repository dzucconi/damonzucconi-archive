import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { createClient, Provider } from "urql";
import { ThemerProvider } from "@auspices/eos";

const client = createClient({ url: "https://api.damonzucconi.com/graph" });

ReactDOM.render(
  <React.StrictMode>
    <Provider value={client}>
      <ThemerProvider>
        <App />
      </ThemerProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
