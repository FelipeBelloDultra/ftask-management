import { lazy } from "react";

export { default as NotificationDetailScreen } from "@/presentation/screens/notifications/details";

export const SignInScreen = lazy(() => import("@/presentation/screens/sign-in"));
export const SignUpScreen = lazy(() => import("@/presentation/screens/sign-up"));
export const DashboardScreen = lazy(() => import("@/presentation/screens/dashboard"));
export const NotificationsScreen = lazy(() => import("@/presentation/screens/notifications"));
export const SettingsScreen = lazy(() => import("@/presentation/screens/settings"));
export const SettingsProfileScreen = lazy(() => import("@/presentation/screens/settings/profile"));
