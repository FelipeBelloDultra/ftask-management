import { fetchAdapter } from "@/infra/adapter/fetch-adapter-http";
import { PersistenceUser, UserMapper } from "@/infra/mappers/user-mapper";

import { UPLOAD_ACCOUNT_PICTURE } from "./endpoints";

interface UploadProfilePictureParams {
  pictureFile: File;
}

export async function uploadProfilePicture({ pictureFile }: UploadProfilePictureParams) {
  const formData = new FormData();
  formData.append("picture", pictureFile);

  const response = await fetchAdapter.patch<PersistenceUser>(UPLOAD_ACCOUNT_PICTURE, formData);

  return UserMapper.toDomain(response);
}
