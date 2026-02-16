import { GetStaticPropsContext, NextPage } from "next";
import { ReactNode, useEffect, useState } from "react";
import {
  cacheExchange,
  createClient,
  fetchExchange,
  gql,
  Provider,
  SSRData,
  ssrExchange,
} from "urql";

export const GRAPHQL_ENDPOINT = "https://api.damonzucconi.com/graph";
// export const GRAPHQL_ENDPOINT = "http://localhost:5001/graph";

type UrqlState = SSRData;

export const client = createClient({
  url: GRAPHQL_ENDPOINT,
  exchanges: [cacheExchange, fetchExchange],
});

const createHydratedClient = (urqlState?: UrqlState) => {
  const ssr = ssrExchange({
    isClient: typeof window !== "undefined",
    initialState: urqlState,
  });

  const hydratedClient = createClient({
    url: GRAPHQL_ENDPOINT,
    exchanges: [cacheExchange, ssr, fetchExchange],
  });

  return { hydratedClient, ssr };
};

export const UrqlProvider = ({
  children,
  urqlState,
}: {
  children: ReactNode;
  urqlState?: UrqlState;
}) => {
  const [{ hydratedClient, ssr }] = useState(() =>
    createHydratedClient(urqlState)
  );

  useEffect(() => {
    if (!urqlState) return;
    ssr.restoreData(urqlState);
  }, [ssr, urqlState]);

  return <Provider value={hydratedClient}>{children}</Provider>;
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
