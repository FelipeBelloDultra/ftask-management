import { Navigate, Route, Routes } from "react-router-dom";

import { AuthenticatedLayout } from "@/presentation/layouts/authenticated";
import { UnauthenticatedLayout } from "@/presentation/layouts/unauthenticated";
import {
  DashboardScreen,
  NotificationDetailScreen,
  NotificationsScreen,
  SettingsProfileScreen,
  SettingsScreen,
  SignInScreen,
  SignUpScreen,
} from "@/presentation/screens";

import { AuthGuard } from "./auth-guard";

export function Router() {
  return (
    <Routes>
      <Route element={<AuthGuard isPrivate={false} />}>
        <Route element={<UnauthenticatedLayout />}>
          <Route path="/sign-in" element={<SignInScreen />} />
          <Route path="/sign-up" element={<SignUpScreen />} />
        </Route>
      </Route>

      <Route element={<AuthGuard isPrivate={true} />}>
        <Route path="/dash" element={<AuthenticatedLayout />}>
          <Route index element={<DashboardScreen />} />
          <Route path="notifications" element={<NotificationsScreen />}>
            <Route path=":notificationId" element={<NotificationDetailScreen />} />
          </Route>
          <Route path="settings">
            <Route index element={<SettingsScreen />} />
            <Route path="profile" element={<SettingsProfileScreen />} />
          </Route>
          <Route path="projects">
            <Route index element={<div>main projects page</div>} />
            <Route path="my" element={<div>My projects</div>} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dash" replace />} />
    </Routes>
  );
}
