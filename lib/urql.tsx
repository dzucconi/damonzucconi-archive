import { FC } from "react";
import { createClient, Provider } from "urql";

export const GRAPHQL_ENDPOINT = "https://api.damonzucconi.com/graph";
// export const GRAPHQL_ENDPOINT = "http://localhost:5001/graph";

export const client = createClient({
  url: GRAPHQL_ENDPOINT,
});

export const UrqlProvider: FC = ({ children }) => {
  return <Provider value={client}>{children}</Provider>;
};
