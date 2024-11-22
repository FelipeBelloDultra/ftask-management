import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";

import { DependenciesProvider } from "./dependencies-provider";
import { ThemeProvider } from "./theme-provider";

interface AppProviderProps {
  children: ReactNode;
}

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export function AppProvider({ children }: AppProviderProps) {
  return (
    <DependenciesProvider>
      <QueryClientProvider client={client}>
        <ThemeProvider>
          {children}
          <ReactQueryDevtools />
        </ThemeProvider>
      </QueryClientProvider>
    </DependenciesProvider>
  );
}
