import { Http } from "../http";

type Methods = "GET" | "OPTIONS" | "POST";

interface CreateRequestSchema {
  url: string;
  method: Methods;
  options?: RequestInit;
}

export class FetchAdapterHttp implements Http {
  private readonly baseUrl: string = import.meta.env.VITE_APP_API_URL;

  private makeUrl(url: string | URL) {
    return `${this.baseUrl}${url}`;
  }

  private createRequestSchema({ method, url, options }: CreateRequestSchema) {
    return new Request(url, {
      ...options,
      method,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers && options.headers),
      },
    });
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

    if (!response.ok) {
      return Promise.reject(response);
    }

    const { data } = (await response.json()) as { data: ResponseType };

    return data;
  }
}

export const fetchAdapter = new FetchAdapterHttp();
