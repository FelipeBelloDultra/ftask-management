import { createContext, ReactNode, useLayoutEffect } from "react";

import { AuthAdapter, AuthHttpAdapter, AuthRoutes } from "@/adapters/auth-adapter";
import { NotificationAdapter, NotificationHttpAdapter } from "@/adapters/notification-adapter";
import { ProfileAdapter, ProfileHttpAdapter } from "@/adapters/profile-adapter";
import { ProjectAdapter, ProjectHttpAdapter } from "@/adapters/project-adapter";
import { env } from "@/config/env";
import { HttpClientAdapter } from "@/infra/adapter/fetch-adapter-http";

import { useLogout } from "../hooks/use-logout";

interface DependenciesProviderProps {
  children: ReactNode;
}

interface DependenciesContextProps {
  authAdapter: AuthAdapter;
  profileAdapter: ProfileAdapter;
  notificationAdapter: NotificationAdapter;
  projectAdapter: ProjectAdapter;
}

export const DependenciesContext = createContext({} as DependenciesContextProps);

const httpClient = new HttpClientAdapter();

const authAdapter = new AuthHttpAdapter(httpClient);
const profileAdapter = new ProfileHttpAdapter(httpClient);
const notificationAdapter = new NotificationHttpAdapter(httpClient);
const projectAdapter = new ProjectHttpAdapter(httpClient);

export function DependenciesProvider({ children }: DependenciesProviderProps) {
  const logout = useLogout();

  useLayoutEffect(() => {
    const interceptorId = httpClient.registerResponseInterceptor(async (response, originalRequest) => {
      const isFromRefreshTokenRoute = originalRequest.url.includes(AuthRoutes.RefreshToken);
      const isNotAllowed = response.status === 401;

      if (isNotAllowed && isFromRefreshTokenRoute) {
        logout();
        return Promise.reject(response);
      }

      if (isNotAllowed && !isFromRefreshTokenRoute) {
        try {
          const { token: newToken } = await authAdapter.refreshToken();

          localStorage.setItem(env.jwtPrefix, newToken);
          originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
          const retryRequest = new Request(originalRequest);

          return await fetch(retryRequest);
        } catch (error) {
          return Promise.reject(response);
        }
      }

      return response;
    });

    return () => {
      httpClient.removeResponseInterceptor(interceptorId);
    };
  }, []);

  const dependencies = {
    authAdapter,
    profileAdapter,
    notificationAdapter,
    projectAdapter,
  };

  return <DependenciesContext.Provider value={dependencies}>{children}</DependenciesContext.Provider>;
}
