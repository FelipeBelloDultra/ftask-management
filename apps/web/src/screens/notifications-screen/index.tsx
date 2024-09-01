import { BellDot as BellDotIcon, Bell as BellIcon, EyeIcon } from "lucide-react";

import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { readNotificationService } from "@/services/mark-notification-as-read";

import * as Loadings from "./components/loadings";
import { NotificationFilters } from "./components/notification-filters";
import { useNotifications } from "./useNotifications";

export function NotificationsScreen() {
  const { data, page, read, isLoading, handleSetSearchParams, handleSelectFilter } = useNotifications();

  function updateNotification(id: string) {
    readNotificationService({
      notificationId: id,
    });
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Notification center</CardTitle>
        {isLoading ? (
          <Loadings.SkeletonLoadingFilters />
        ) : (
          <NotificationFilters read={read} onSetRead={handleSelectFilter} />
        )}
      </CardHeader>
      <CardContent>
        {!isLoading && !data?.notifications.length ? (
          <h4 className="text-muted-foreground text-lg mt-3">No notifications found.</h4>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Status</TableHead>
                <TableHead className="w-[450px]">Message</TableHead>
                <TableHead className="text-right">Received at</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? <Loadings.SkeletonLoadingTableData /> : null}

              {!isLoading && !!data?.notifications.length
                ? data.notifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>
                        {!notification.readAt ? (
                          <Button variant="ghost" size="icon" onClick={() => updateNotification(notification.id)}>
                            <BellDotIcon className="h-5 w-5 text-blue-500" />
                          </Button>
                        ) : (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="size-10 flex items-center justify-center opacity-50">
                                  <BellIcon className="h-5 w-5 text-muted-foreground" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                Read at: <br />
                                {notification.getRelativeDate(notification.readAt)}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        <p className="truncate w-[450px]">{notification.content}</p>
                      </TableCell>
                      <TableCell className="text-right">
                        {notification.getRelativeDate(notification.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <EyeIcon className="text-muted-foreground size-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <CardFooter className="pt-6">
        <div className="flex flex-col flex-1">
          {isLoading ? (
            <Loadings.SkeletonLoadingPagination />
          ) : (
            <Pagination
              onLimitPerPageChange={(limit) => handleSetSearchParams("limit", limit)}
              onPageChange={(page) => handleSetSearchParams("page", String(page))}
              page={page}
              perPage={data?.pagination.limit || 0}
              totalCount={data?.pagination.total.records || 0}
            />
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
