import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { UploaderProvider, UploadParams } from "@/application/providers/storage/uploader.provider";

export class LocalStorage implements UploaderProvider {
  public async upload({ fileName, fileType: _, body }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID();
    const uniqueFileName = `${uploadId}-${fileName}`;
    const path = resolve(__dirname, "..", "..", "..", "storage", "uploads", uniqueFileName);

    await writeFile(path, body);

    return {
      url: uniqueFileName,
    };
  }
}
