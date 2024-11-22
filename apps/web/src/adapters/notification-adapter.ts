import { HttpClientAdapter } from "@/infra/adapter/fetch-adapter-http";

interface NotificationAdapter {}

export class NotificationHttpAdapter implements NotificationAdapter {
  public constructor(private readonly http: HttpClientAdapter) {}
}
