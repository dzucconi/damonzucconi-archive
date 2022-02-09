import { useMemo } from "react";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { createNetworkStatusNotifier } from "react-apollo-network-status";

export const GRAPHQL_ENDPOINT = "https://api.damonzucconi.com/graph";
// export const GRAPHQL_ENDPOINT = "http://localhost:5001/graph";

let apolloClient: ApolloClient<NormalizedCacheObject>;

export const { link: statusLink, useApolloNetworkStatus } =
  createNetworkStatusNotifier();

const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: statusLink.concat(
      new HttpLink({
        uri: GRAPHQL_ENDPOINT,
        credentials: "same-origin",
      })
    ),
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
  const store = useMemo(() => {
    return initApolloClient(initialState);
    // Only re-hydrate the store on intial render
  }, []);

  return store;
};
