import { createBrowserRouter, Navigate } from "react-router-dom";

import { AuthenticatedLayout } from "@/layouts/authenticated";
import { UnauthenticatedLayout } from "@/layouts/unauthenticated";
import { DashScreen } from "@/screens/dash-screen";
import { NotificationsScreen } from "@/screens/notifications-screen";
import { SettingsProfileScreen } from "@/screens/settings-profile-screen";
import { SettingsScreen } from "@/screens/settings-screen";
import { SignInScreen } from "@/screens/sign-in-screen";
import SignUpScreen from "@/screens/sign-up-screen";

export const router = createBrowserRouter([
  {
    path: "*",
    element: <Navigate to="/sign-in" />,
  },
  {
    path: "/",
    element: <Navigate to="/sign-in" />,
  },
  {
    element: <UnauthenticatedLayout />,
    children: [
      {
        path: "sign-in",
        element: <SignInScreen />,
      },
      {
        path: "sign-up",
        element: <SignUpScreen />,
      },
    ],
  },
  {
    path: "dash",
    element: <AuthenticatedLayout />,
    children: [
      {
        index: true,
        element: <DashScreen />,
      },
      {
        path: "notifications",
        element: <NotificationsScreen />,
      },
      {
        path: "settings",
        children: [
          {
            index: true,
            element: <SettingsScreen />,
          },
          {
            path: "profile",
            element: <SettingsProfileScreen />,
          },
        ],
      },
    ],
  },
]);
