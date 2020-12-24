import { useMemo } from "react";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";

export const GRAPHQL_ENDPOINT = "https://api.damonzucconi.com/graph";

let apolloClient: ApolloClient<NormalizedCacheObject>;

const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: new HttpLink({ uri: GRAPHQL_ENDPOINT, credentials: "same-origin" }),
    cache: new InMemoryCache(),
  });
};

export const initApolloClient = (initialState = {}) => {
  const _apolloClient = apolloClient ?? createApolloClient();

  // Hydrate initial state
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Restore the cache using the data passed from getStaticProps/getServerSideProps
    // combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
};

export const useApollo = (initialState = {}) => {
  const store = useMemo(() => initApolloClient(initialState), [initialState]);
  return store;
};
