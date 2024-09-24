import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

import { Choose, If, Otherwise, When } from "@/presentation/components/conditionals";
import { BellDotIcon, BellIcon, EyeIcon } from "@/presentation/components/icons";
import { Pagination } from "@/presentation/components/pagination";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Dialog } from "@/presentation/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/presentation/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/presentation/components/ui/tooltip";

import * as Loadings from "./_components/loadings";
import { NotificationFilters } from "./_components/notification-filters";
import { useNotifications } from "./_hooks/use-notifications";

export function NotificationsScreen() {
  const { data, page, read, isLoading, handleSetSearchParams, handleSelectFilter, handleReadNotification } =
    useNotifications();
  const { search } = useLocation();
  const { notificationId } = useParams() as { notificationId: string | undefined };
  const navigate = useNavigate();

  const isNotLoadingAndHasData = !isLoading && !!data?.notifications.length;
  const isNotLoadingAndHasNoData = !isLoading && !data?.notifications.length;

  function handleNavigateToNotificationDetail(notificationId: string) {
    navigate(`/dash/notifications/${notificationId}${search}`);
  }

  function onCloseNotificationDetail(isOpen: boolean) {
    if (!isOpen) {
      navigate(`/dash/notifications${search}`);
    }
  }

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Notification center</CardTitle>
          <Choose>
            <When condition={isLoading}>
              <Loadings.SkeletonLoadingFilters />
            </When>

            <Otherwise>
              <NotificationFilters read={read} onSetRead={handleSelectFilter} />
            </Otherwise>
          </Choose>
        </CardHeader>
        <CardContent>
          <Choose>
            <When condition={isNotLoadingAndHasNoData}>
              <h4 className="text-muted-foreground text-lg mt-3">No notifications found.</h4>
            </When>

            <Otherwise>
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
                  <If condition={isLoading}>
                    <Loadings.SkeletonLoadingTableData />
                  </If>

                  <If condition={isNotLoadingAndHasData}>
                    {data?.notifications.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell>
                          <Choose>
                            <When condition={!notification.readAt}>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleReadNotification(notification.id)}
                              >
                                <BellDotIcon className="h-5 w-5 text-blue-500" />
                              </Button>
                            </When>

                            <Otherwise>
                              <TooltipProvider>
                                <Tooltip>
                                  <Button variant="ghost" size="icon" className="cursor-default opacity-50" asChild>
                                    <TooltipTrigger>
                                      <BellIcon className="h-5 w-5 text-muted-foreground" />
                                    </TooltipTrigger>
                                  </Button>
                                  <TooltipContent>
                                    Read at: <br />
                                    {notification.getRelativeDate(notification.readAt as Date)}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Otherwise>
                          </Choose>
                        </TableCell>
                        <TableCell className="font-medium">
                          <p className="truncate w-[450px]">{notification.content}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          {notification.getRelativeDate(notification.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleNavigateToNotificationDetail(notification.id)}
                          >
                            <EyeIcon className="text-muted-foreground size-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </If>
                </TableBody>
              </Table>
            </Otherwise>
          </Choose>
        </CardContent>

        <CardFooter className="pt-6">
          <div className="flex flex-col flex-1">
            <Choose>
              <When condition={isLoading}>
                <Loadings.SkeletonLoadingPagination />
              </When>

              <Otherwise>
                <Pagination
                  onLimitPerPageChange={(limit) => handleSetSearchParams("limit", limit)}
                  onPageChange={(page) => handleSetSearchParams("page", String(page))}
                  page={page}
                  perPage={data?.pagination.limit || 0}
                  totalCount={data?.pagination.total.records || 0}
                />
              </Otherwise>
            </Choose>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={!!notificationId} onOpenChange={onCloseNotificationDetail}>
        <Outlet />
      </Dialog>
    </>
  );
}
