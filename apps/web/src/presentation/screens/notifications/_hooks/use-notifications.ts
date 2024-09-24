import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { fetchAllNotifications } from "@/services/fetch-all-notifications";
import { readNotificationService } from "@/services/mark-notification-as-read";

function createReadCacheKey(read: boolean | undefined) {
  if (read === undefined) {
    return "read:all";
  }

  if (!read) {
    return "read:unread";
  }

  return "read:read";
}

export function useNotifications() {
  const [searchParams, setSearchParams] = useSearchParams();

  const limit = Number(searchParams.get("limit") || "10");
  const readFromUrl = searchParams.get("read");
  const read = readFromUrl !== null ? readFromUrl === "true" : undefined;
  const page = Number(searchParams.get("page") || "1");

  const { data, isLoading } = useQuery({
    queryKey: ["notifications", createReadCacheKey(read), `limit:${limit}`, `page:${page}`],
    queryFn: () => fetchAllNotifications({ read, limit, page }),
  });
  const queryClient = useQueryClient();

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

  async function handleReadNotification(notificationId: string) {
    await readNotificationService({
      notificationId,
    });
    await queryClient.invalidateQueries({
      queryKey: ["notifications"],
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
    handleReadNotification,
    isLoading,
    data,
    read,
    page,
  };
}
