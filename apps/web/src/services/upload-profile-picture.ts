import { httpClientAdapter } from "@/infra/adapter/fetch-adapter-http";
import { HttpMethods } from "@/infra/http";
import { PersistenceUser, UserMapper } from "@/infra/mappers/user-mapper";

import { UPLOAD_ACCOUNT_PICTURE } from "./endpoints";

interface UploadProfilePictureParams {
  pictureFile: File;
}

export async function uploadProfilePicture({ pictureFile }: UploadProfilePictureParams) {
  const formData = new FormData();
  formData.append("picture", pictureFile);

  const response = await httpClientAdapter.sendRequest<PersistenceUser, FormData>({
    method: HttpMethods.PATCH,
    url: UPLOAD_ACCOUNT_PICTURE,
    body: formData,
  });

  return UserMapper.toDomain(response);
}
