import { useQuery } from "@tanstack/react-query";

import { fetchAllNotifications } from "@/services/fetch-all-notifications";

export function NotificationsScreen() {
  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchAllNotifications(),
  });

  console.log(data);

  return <div>NotificationsScreen</div>;
}
