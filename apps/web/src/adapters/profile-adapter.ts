import { User } from "@/domain/user";
import { HttpClient, HttpMethods } from "@/infra/http";
import { PersistenceUser, UserMapper } from "@/infra/mappers/user-mapper";

export interface ProfileAdapter {
  getAuthenticated(): Promise<User>;
  uploadPicture(pictureFile: File): Promise<User>;
}

enum ProfileRoutes {
  GetAuthenticated = "/account/session/me",
  UploadPicture = "/account/upload/picture",
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

  public async uploadPicture(pictureFile: File): Promise<User> {
    const formData = new FormData();
    formData.append("picture", pictureFile);

    const response = await this.http.sendRequest<PersistenceUser, FormData>({
      method: HttpMethods.PATCH,
      url: ProfileRoutes.UploadPicture,
      body: formData,
    });

    return UserMapper.toDomain(response);
  }
}
