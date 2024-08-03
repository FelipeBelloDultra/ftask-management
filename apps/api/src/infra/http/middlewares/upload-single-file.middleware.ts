import path from "path";

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
      fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
          return cb(null, true);
        } else {
          cb(new Error("Invalid format (only jpeg, jpg and png)"));
        }
      },
    }).single(fileName);

    return upload;
  }
}
