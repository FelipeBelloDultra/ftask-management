import { User } from "@/domain/user";
import { HttpClient, HttpMethods } from "@/infra/http";
import { PersistenceUser, UserMapper } from "@/infra/mappers/user-mapper";

export interface ProfileAdapter {
  getAuthenticated(): Promise<User>;
}

enum ProfileRoutes {
  GetAuthenticated = "/account/session/me",
}

export class ProfileHttpAdapter implements ProfileAdapter {
  public constructor(private readonly http: HttpClient) {}

  public async getAuthenticated(): Promise<User> {
    const response = await this.http.sendRequest<PersistenceUser>({
      method: HttpMethods.GET,
      url: ProfileRoutes.GetAuthenticated,
    });

    return UserMapper.toDomain(response);
  }
}
