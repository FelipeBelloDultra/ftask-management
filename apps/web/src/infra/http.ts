export interface HttpRequest<Body> {
  url: string | URL;
  method: HttpMethods;
  headers?: Record<string, string>;
  body?: Body;
}

export interface HttpClient {
  sendRequest<TResponse = void, TBody = unknown>(request: HttpRequest<TBody>): Promise<TResponse>;
}

export enum HttpMethods {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE",
  PUT = "PUT",
}
