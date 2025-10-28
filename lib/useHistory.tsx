import { Router, useRouter } from "next/router";
import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const MAX_LENGTH = 10;

const HistoryContext = createContext<{
  history: string[];
}>({
  history: [],
});

interface HistoryProviderProps {
  children: ReactNode;
}

export const HistoryProvider: FC<HistoryProviderProps> = ({ children }) => {
  const router = useRouter();

  const [history, setHistory] = useState<string[]>([router.asPath]);

  useEffect(() => {
    const handleRouteChangeComplete = (pathname: string, routeProps: any) => {
      if (routeProps.shallow) return;
      setHistory((prev) => {
        if (prev[0] === pathname) {
          return prev;
        }

        const next = [pathname, ...prev];

        if (next.length > MAX_LENGTH) {
          next.pop();
        }

        return next;
      });
    };

    Router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      Router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, []);

  return (
    <HistoryContext.Provider value={{ history }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  return useContext(HistoryContext);
};
