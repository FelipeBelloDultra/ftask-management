import { Request, Response } from "express";
// import multer from "multer";

import { Controller, ControllerMethods } from "@/infra/http/controller";

// import { Middleware } from "../../middleware";

// class MulterMiddleware implements Middleware {
//   public handler<T extends string>(fileName: T) {
//     return async (req: Request, res: Response, next: NextFunction) => {
//       const upload = multer({
//         storage: multer.memoryStorage(),
//       });

//       upload.single(fileName);
//       return next();
//     };
//   }
// }

export class UploadAccountIconController extends Controller {
  public constructor() {
    super({
      method: ControllerMethods.PATCH,
      path: "/account/upload/icon",
      middlewares: [
        // multer({
        //   storage: multer.memoryStorage(),
        //   limits: {
        //     fileSize: 2 * 1024 * 1024, // limit file size to 2MB
        //   },
        // }).single("file"),
      ],
    });
  }

  public async handler(req: Request, res: Response): Promise<Response> {
    // console.log(req.file);

    return res.json({ ok: true });
  }
}
