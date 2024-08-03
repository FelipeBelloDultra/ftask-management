import { container, Lifecycle } from "tsyringe";

import { UploaderProvider } from "@/application/providers/storage/uploader.provider";

import { S3Storage } from "./s3-storage";

container.register<UploaderProvider>(
  "UploaderProvider",
  {
    useClass: S3Storage,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);
