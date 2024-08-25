import { BellDot as BellDotIcon, Bell as BellIcon } from "lucide-react";

import { Pagination } from "@/components/pagination";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import * as Loadings from "./components/loadings";
import { NotificationFilters } from "./components/notification-filters";
import { useNotifications } from "./useNotifications";

export function NotificationsScreen() {
  const { data, page, read, isLoading, handleSetSearchParams, handleSelectFilter } = useNotifications();

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
                <TableHead className="w-[550px]">Message</TableHead>
                <TableHead className="text-right">Received at</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? <Loadings.SkeletonLoadingTableData /> : null}

              {!isLoading && !!data?.notifications.length
                ? data.notifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>
                        {!notification.readAt ? (
                          <BellIcon className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <BellDotIcon className="h-5 w-5 text-blue-500" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        <p className="truncate w-[550px]">{notification.content}</p>
                      </TableCell>
                      <TableCell className="text-right">{notification.relativeCreatedAt()}</TableCell>
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
