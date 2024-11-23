import { HttpClientAdapter } from "@/infra/adapter/fetch-adapter-http";
import { HttpMethods } from "@/infra/http";

export interface ProjectAdapter {
  fetchInvolved(): Promise<void>;
}

enum ProjectRoutes {
  FetchInvolved = "/projects",
}

// TODO::: Implement method mapper
export class ProjectHttpAdapter implements ProjectAdapter {
  public constructor(private readonly http: HttpClientAdapter) {}

  public async fetchInvolved(): Promise<void> {
    await this.http.sendRequest({
      method: HttpMethods.GET,
      url: ProjectRoutes.FetchInvolved,
    });
  }
}
