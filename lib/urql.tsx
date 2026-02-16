import { GetStaticPropsContext, NextPage } from "next";
import { ReactNode } from "react";
import {
  cacheExchange,
  createClient,
  fetchExchange,
  gql,
  Provider,
  ssrExchange,
} from "urql";

export const GRAPHQL_ENDPOINT = "https://api.damonzucconi.com/graph";
// export const GRAPHQL_ENDPOINT = "http://localhost:5001/graph";

export const client = createClient({
  url: GRAPHQL_ENDPOINT,
  exchanges: [cacheExchange, fetchExchange],
});

export const UrqlProvider = ({ children }: { children: ReactNode }) => {
  return <Provider value={client}>{children}</Provider>;
};

export const withUrql = <C extends NextPage<any, any>>(AppOrPage: C) => {
  return AppOrPage;
};

export const buildGetStaticProps = (
  getOptions: (ctx: GetStaticPropsContext) => Parameters<typeof client.query>
) => {
  return async (ctx: GetStaticPropsContext) => {
    const ssrCache = ssrExchange({ isClient: false });

    const client = createClient({
      url: GRAPHQL_ENDPOINT,
      exchanges: [cacheExchange, ssrCache, fetchExchange],
    });

    const result = await client.query(...getOptions(ctx)).toPromise();

    if (result.error || !result.data) {
      return { notFound: true };
    }

    return { props: { urqlState: ssrCache.extractData() }, revalidate: 60 };
  };
};
