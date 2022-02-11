import { GetStaticPropsContext, NextPage } from "next";
import { initUrqlClient, withUrqlClient } from "next-urql";
import { FC } from "react";
import {
  cacheExchange,
  createClient,
  dedupExchange,
  fetchExchange,
  gql,
  Provider,
  ssrExchange,
} from "urql";

export const GRAPHQL_ENDPOINT = "https://api.damonzucconi.com/graph";
// export const GRAPHQL_ENDPOINT = "http://localhost:5001/graph";

export const client = createClient({
  url: GRAPHQL_ENDPOINT,
});

export const UrqlProvider: FC = ({ children }) => {
  return <Provider value={client}>{children}</Provider>;
};

export const withUrql = <C extends NextPage<any, any>>(AppOrPage: C) => {
  return withUrqlClient(() => ({ url: GRAPHQL_ENDPOINT }), {
    ssr: false,
  })(AppOrPage);
};

export const buildGetStaticProps = (
  getOptions: (ctx: GetStaticPropsContext) => Parameters<typeof client.query>
) => {
  return async (ctx: GetStaticPropsContext) => {
    const ssrCache = ssrExchange({ isClient: false });

    const client = initUrqlClient(
      {
        url: GRAPHQL_ENDPOINT,
        exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange],
      },
      false
    );

    if (!client) return null;

    await client.query(...getOptions(ctx)).toPromise();

    return { props: { urqlState: ssrCache.extractData() }, revalidate: 30 };
  };
};
