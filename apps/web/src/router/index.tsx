import { Navigate, Route, Routes } from "react-router-dom";

import { AuthenticatedLayout } from "@/layouts/authenticated";
import { UnauthenticatedLayout } from "@/layouts/unauthenticated";
import { NotificationsScreen } from "@/presentation/screens/notifications";
import { DashScreen } from "@/screens/dash-screen";
import { SettingsProfileScreen } from "@/screens/settings-profile-screen";
import { SettingsScreen } from "@/screens/settings-screen";
import { SignInScreen } from "@/screens/sign-in-screen";
import SignUpScreen from "@/screens/sign-up-screen";

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
          <Route index element={<DashScreen />} />
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
