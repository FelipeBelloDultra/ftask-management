import { randomUUID } from "crypto";

import { UploaderProvider, UploadParams } from "@/application/providers/storage/uploader.provider";

interface Upload {
  fileName: string;
  url: string;
}

export class FakeStorageProvider implements UploaderProvider {
  public readonly uploads: Upload[] = [];

  public async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = randomUUID();

    this.uploads.push({
      fileName,
      url,
    });

    return { url };
  }
}
