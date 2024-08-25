import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { fetchAllNotifications } from "@/services/fetch-all-notifications";

export function useNotifications() {
  const [searchParams, setSearchParams] = useSearchParams();

  const limit = Number(searchParams.get("limit") || "10");
  const readFromUrl = searchParams.get("read");
  const read = readFromUrl !== null ? readFromUrl === "true" : undefined;
  const page = Number(searchParams.get("page") || "1");

  const { data, isLoading } = useQuery({
    queryKey: ["notifications", read, limit, page],
    queryFn: () => fetchAllNotifications({ read, limit, page }),
  });

  function handleSetSearchParams(key: string, value?: string) {
    setSearchParams((params) => {
      if (!value) {
        params.delete(key);
        return params;
      }

      params.set(key, value);
      return params;
    });
  }

  function resetPagination() {
    setSearchParams((params) => {
      params.delete("limit");
      params.delete("page");

      return params;
    });
  }

  function handleSelectFilter(value: boolean | undefined) {
    const read = value === undefined ? undefined : String(value);
    resetPagination();
    handleSetSearchParams("read", read);
  }

  return {
    handleSelectFilter,
    handleSetSearchParams,
    isLoading,
    data,
    read,
    page,
  };
}
