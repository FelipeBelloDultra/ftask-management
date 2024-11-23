export interface HttpRequest<Body> {
  url: string | URL;
  method: HttpMethods;
  headers?: Record<string, string>;
  body?: Body;
}

export interface HttpClient {
  sendRequest<TResponse = void, TBody = unknown>(request: HttpRequest<TBody>): Promise<TResponse>;
  registerResponseInterceptor(interceptor: ResponseInterceptor): string;
  removeResponseInterceptor(id: string): void;
}

export enum HttpMethods {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE",
  PUT = "PUT",
}

export type ResponseInterceptor = (response: Response, originalRequest: Request) => Promise<Response>;
