import { useQuery } from "@tanstack/react-query";
import { Navigate, useLocation, useParams } from "react-router-dom";

import { Choose, Otherwise, When } from "@/presentation/components/conditionals";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import { showNotificationDetail } from "@/services/show-notification-detail";

import * as Loadings from "./_components/loadings";

export function NotificationDetailScreen() {
  const { search } = useLocation();
  const { notificationId } = useParams() as { notificationId: string };
  const { data, isLoading, error } = useQuery({
    queryKey: ["notifications", notificationId],
    queryFn: () => showNotificationDetail({ notificationId }),
  });

  const isNotLoadingAndHasData = !isLoading && Boolean(data?.notification);
  const isNotLoadingAndHasNoData = !isLoading && !data?.notification;

  if (error) {
    return <Navigate to={`/dash/notifications${search}`} />;
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          <Choose>
            <When condition={isLoading}>
              <Loadings.SkeletonLoadingDetailTitle />
            </When>

            <Otherwise>{data?.notification.title}</Otherwise>
          </Choose>
        </DialogTitle>
      </DialogHeader>

      <main className="mt-4 flex flex-col gap-8">
        <Choose>
          <When condition={isLoading}>
            <Loadings.SkeletonLoadingDetailContent />
          </When>

          <Otherwise>
            <DialogDescription>{data?.notification.content}</DialogDescription>
          </Otherwise>
        </Choose>

        <DialogFooter>test</DialogFooter>
      </main>
    </DialogContent>
  );
}
