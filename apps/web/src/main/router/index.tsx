import { Navigate, Route, Routes } from "react-router-dom";

import { AuthenticatedLayout } from "@/presentation/layouts/authenticated";
import { UnauthenticatedLayout } from "@/presentation/layouts/unauthenticated";
import { DashboardScreen } from "@/presentation/screens/dashboard";
import { NotificationsScreen } from "@/presentation/screens/notifications";
import { SettingsScreen } from "@/presentation/screens/settings";
import { SettingsProfileScreen } from "@/presentation/screens/settings/profile";
import { SignInScreen } from "@/presentation/screens/sign-in";
import SignUpScreen from "@/presentation/screens/sign-up";

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
          <Route path="notifications" element={<NotificationsScreen />} />
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
