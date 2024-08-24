import { Bell as BellIcon } from "lucide-react";

import { Pagination } from "@/components/pagination";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { NotificationFilters } from "./components/notification-filters";
import { useNotifications } from "./useNotifications";

export function NotificationsScreen() {
  const { data, page, read, limit, handleSetSearchParams, handleSelectFilter } = useNotifications();

  return data ? (
    <Card className="w-full max-w-4xl mx-auto mt-5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Notification center</CardTitle>
        <NotificationFilters read={read} onSetRead={handleSelectFilter} />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Status</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="text-right">Received at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.notifications.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell>
                  <BellIcon className={`h-5 w-5 ${!notification.readAt ? "text-muted-foreground" : "text-blue-500"}`} />
                </TableCell>
                <TableCell className="font-medium">{notification.content}</TableCell>
                <TableCell className="text-right">{notification.relativeCreatedAt()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-6">
        <div>
          <Select onValueChange={(value) => handleSetSearchParams("limit", value)}>
            <SelectTrigger className="gap-2">
              Per page
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Items per page</SelectLabel>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Pagination
          onPageChange={(page) => handleSetSearchParams("page", String(page))}
          page={page}
          perPage={data.pagination.limit}
          totalCount={data.pagination.total.records}
        />
      </CardFooter>
    </Card>
  ) : null;
}
