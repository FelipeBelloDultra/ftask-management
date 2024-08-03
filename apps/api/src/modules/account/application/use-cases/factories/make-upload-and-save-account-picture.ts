import { container } from "tsyringe";

import { UploadAndSaveAccountPictureUseCase } from "../upload-and-save-account-picture.use-case";

export function makeUploadAndSaveAccountPictureUseCase() {
  const uploadAndSaveAccountPicture = container.resolve(UploadAndSaveAccountPictureUseCase);

  return uploadAndSaveAccountPicture;
}
