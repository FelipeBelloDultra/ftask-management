import { container } from "tsyringe";

import { UploadAndSaveProjectIconUrlUseCase } from "../upload-and-save-project-icon-url.use-case";

export function makeUploadAndSaveProjectIconUrl() {
  const uploadAndSaveProjectIconUrl = container.resolve(UploadAndSaveProjectIconUrlUseCase);

  return uploadAndSaveProjectIconUrl;
}
