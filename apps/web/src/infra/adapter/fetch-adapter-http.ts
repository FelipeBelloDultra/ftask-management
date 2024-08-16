import { env } from "@/config/env";
import { REFRESH_TOKEN } from "@/services/endpoints";

import { Http } from "../http";

type Methods = "GET" | "OPTIONS" | "POST" | "PATCH";

interface CreateRequestSchema {
  url: string;
  method: Methods;
  options?: RequestInit;
}

export class FetchAdapterHttp implements Http {
  private readonly baseUrl: string = env.apiUrl;

  private makeUrl(url: string | URL) {
    return `${this.baseUrl}${url}`;
  }

  private createRequestSchema({ method, url, options }: CreateRequestSchema) {
    const authorizationToken = localStorage.getItem(env.jwtPrefix);
    const hasAuthorizationToken = !!authorizationToken;

    return new Request(url, {
      ...options,
      method,
      headers: {
        "Content-Type": "application/json",
        ...(!!hasAuthorizationToken && {
          Authorization: `Bearer ${authorizationToken}`,
        }),
        ...(options?.headers && options.headers),
      },
      credentials: "include",
    });
  }

  private async refreshToken<ResponseType>(originalRequest: Request): Promise<ResponseType> {
    const url = this.makeUrl(REFRESH_TOKEN);
    const refreshTokenResponse = await fetch(
      this.createRequestSchema({
        method: "PATCH",
        url,
      }),
    );

    if (!refreshTokenResponse.ok) {
      return Promise.reject(refreshTokenResponse);
    }

    const {
      data: { token },
    } = (await refreshTokenResponse.json()) as { data: { token: string } };

    localStorage.setItem(env.jwtPrefix, token);
    originalRequest.headers.append("Authorization", `Bearer ${token}`);

    const originalRequestResponse = await fetch(originalRequest);

    if (!originalRequestResponse.ok) {
      return Promise.reject(originalRequestResponse);
    }

    const { data } = (await originalRequestResponse.json()) as { data: ResponseType };
    return data;
  }

  public async get<ResponseType = unknown>(
    url: string | URL,
    options?: Omit<RequestInit, "method" | "body">,
  ): Promise<ResponseType> {
    const request = this.createRequestSchema({
      method: "GET",
      url: this.makeUrl(url),
      options,
    });
    const response = await fetch(request);

    if (response.status === 401) {
      return await this.refreshToken(request);
    }

    if (!response.ok) {
      return Promise.reject(response);
    }

    const { data } = (await response.json()) as { data: ResponseType };

    return data;
  }

  public async post<ResponseType = unknown, RequestBody = unknown>(
    url: string | URL,
    body: RequestBody,
    options?: Omit<RequestInit, "method">,
  ): Promise<ResponseType> {
    const request = this.createRequestSchema({
      method: "POST",
      url: this.makeUrl(url),
      options: {
        ...options,
        body: JSON.stringify(body),
      },
    });
    const response = await fetch(request);

    if (response.status === 401) {
      return await this.refreshToken(request);
    }

    if (!response.ok) {
      return Promise.reject(response);
    }

    const { data } = (await response.json()) as { data: ResponseType };

    return data;
  }
}

export const fetchAdapter = new FetchAdapterHttp();
