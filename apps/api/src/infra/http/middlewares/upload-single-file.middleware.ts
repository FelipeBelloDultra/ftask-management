import multer from "multer";

import { Middleware } from "../middleware";

export class UploadSingleFileMiddleware implements Middleware {
  public handle<HandleData = unknown>(data: HandleData) {
    const fileName = data as string;
    const upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 2 * 1024 * 1024, // limit file size to 2MB
      },
    }).single(fileName);

    return upload;
  }
}
