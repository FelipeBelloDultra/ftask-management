import { useContext } from "react";

import { DependenciesContext } from "../providers/dependencies-provider";

export function useDependencies() {
  const context = useContext(DependenciesContext);

  if (!context) {
    throw new Error("useDependencies must be within DependenciesContext");
  }

  return context;
}
