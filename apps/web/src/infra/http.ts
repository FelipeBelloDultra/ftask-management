export interface Http {
  get<ResponseType = unknown>(url: string | URL, options?: Omit<RequestInit, "method" | "body">): Promise<ResponseType>;
  post<ResponseType = unknown, RequestBody = unknown>(
    url: string | URL,
    body: RequestBody,
    options?: Omit<RequestInit, "method">,
  ): Promise<ResponseType>;
}
