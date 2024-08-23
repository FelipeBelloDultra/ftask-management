import { useQuery } from "@tanstack/react-query";
import { Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchAllNotifications } from "@/services/fetch-all-notifications";

import { NotificationFilters } from "./components/notification-filters";

export function NotificationsScreen() {
  const [notificationSearchParams, setNotificationSearchParams] = useSearchParams();
  const [readFilter, setReadFilter] = useState<boolean>(() => notificationSearchParams.get("read") === "true");
  const { data } = useQuery({
    queryKey: ["notifications", readFilter],
    queryFn: () => fetchAllNotifications({ read: readFilter }),
  });

  useEffect(() => {
    setNotificationSearchParams((params) => {
      params.set("read", String(readFilter));

      return params;
    });
  }, [readFilter]);

  return (
    <Card className="w-full max-w-4xl mx-auto mt-5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Notification center</CardTitle>
        <NotificationFilters read={readFilter} onSetRead={setReadFilter} />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Status</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data.notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>
                    <Bell className={`h-5 w-5 ${!notification.readAt ? "text-muted-foreground" : "text-blue-500"}`} />
                  </TableCell>
                  <TableCell className="font-medium">{notification.content}</TableCell>
                  <TableCell className="text-right">"time"</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-6">
        <div className="text-sm text-muted-foreground">Showing 10 of 40</div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled={1 === 1}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm font-medium">Page 1 of 2</div>
          <Button variant="outline" size="sm" disabled={1 === 2}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
