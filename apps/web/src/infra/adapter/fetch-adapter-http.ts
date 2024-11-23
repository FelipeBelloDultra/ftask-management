import { env } from "@/config/env";

import { HttpClient, HttpRequest, ResponseInterceptor } from "../http";

export class HttpClientAdapter implements HttpClient {
  private responseInterceptors = new Map<string, ResponseInterceptor>();

  public constructor(private readonly baseUrl = env.apiUrl) {}

  private generateInterceptorId(): string {
    return Math.random().toString(16).slice(2);
  }

  public removeResponseInterceptor(id: string): void {
    this.responseInterceptors.delete(id);
  }

  public registerResponseInterceptor(interceptor: ResponseInterceptor): string {
    const interceptorId = this.generateInterceptorId();
    this.responseInterceptors.set(interceptorId, interceptor);

    return interceptorId;
  }

  public async sendRequest<TResponse = unknown, TBody = unknown>({
    body,
    method,
    url,
    headers,
  }: HttpRequest<TBody>): Promise<TResponse> {
    const request = this.makeRequestObject<TBody>({
      method,
      url: this.makeUrl(url),
      body,
      headers,
    });
    let response = await fetch(request);

    for (const responseInterceptor of this.responseInterceptors.values()) {
      response = await responseInterceptor(response, request);
    }

    return await this.formatResponse<TResponse>(response);
  }

  private makeUrl(url: string | URL) {
    return `${this.baseUrl}${url}`;
  }

  private formatBody<TBody>(body: HttpRequest<TBody>["body"]): string | Blob | FormData {
    if (typeof body === "string") {
      return body;
    }
    if (body instanceof Blob) {
      return body;
    }
    if (body instanceof ArrayBuffer) {
      return new Blob([body]);
    }
    if (body instanceof FormData) {
      return body;
    }
    if (typeof body === "object") {
      return JSON.stringify(body);
    }

    throw new Error("invalid body type");
  }

  private makeRequestContentType(body: string | Blob | FormData | undefined) {
    if (typeof body === "string") {
      try {
        JSON.parse(body);
        return "application/json";
      } catch {
        return "text/plain";
      }
    }

    if (body instanceof Blob) {
      return body.type || "application/octet-stream";
    }

    if (body instanceof FormData) {
      return undefined;
    }

    return "application/json";
  }

  private makeRequestObject<TBody>(request: HttpRequest<TBody>) {
    const authorizationToken = localStorage.getItem(env.jwtPrefix);
    const hasAuthorizationToken = !!authorizationToken;
    const body = request.body ? this.formatBody(request.body) : undefined;
    const contentType = this.makeRequestContentType(body);

    return new Request(request.url, {
      method: request.method,
      headers: {
        ...(Boolean(contentType) && {
          "Content-Type": contentType,
        }),
        ...request.headers,
        ...(hasAuthorizationToken && {
          Authorization: `Bearer ${authorizationToken}`,
        }),
      },
      credentials: "include",
      body,
    });
  }

  private async formatResponse<TResponse>(response: Response): Promise<TResponse> {
    if (!response.ok) {
      return Promise.reject(response);
    }

    if (response.status === 204) {
      return void 0 as TResponse;
    }

    const responseBody = (await response.json()) as { data: TResponse };
    return responseBody.data;
  }
}

export const httpClientAdapter = new HttpClientAdapter();
