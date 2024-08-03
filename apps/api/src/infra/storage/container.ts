import { container, Lifecycle } from "tsyringe";

import { UploaderProvider } from "@/application/providers/storage/uploader.provider";
import { Env } from "@/config/env";

import { LocalStorage } from "./local-storage";
import { S3Storage } from "./s3-storage";

container.register<UploaderProvider>(
  "UploaderProvider",
  {
    useClass: Env.storageDriverIs(["aws"]) ? S3Storage : LocalStorage,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);
