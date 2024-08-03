import { randomUUID } from "node:crypto";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { UploaderProvider, UploadParams } from "@/application/providers/storage/uploader.provider";
import { Env } from "@/config/env";

export class S3Storage implements UploaderProvider {
  private readonly client: S3Client;

  public constructor() {
    this.client = new S3Client({
      region: Env.get("AWS_DEFAULT_REGION"),
      forcePathStyle: true,
      endpoint: Env.get("AWS_ENDPOINT"),
      credentials: {
        accessKeyId: Env.get("AWS_ACCESS_KEY_ID"),
        secretAccessKey: Env.get("AWS_SECRET_ACCESS_KEY"),
      },
    });
  }

  public async upload({ fileName, fileType, body }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID();
    const uniqueFileName = `${uploadId}-${fileName}`;

    const putObjectCommand = new PutObjectCommand({
      Bucket: Env.get("AWS_BUCKET"),
      Key: uniqueFileName,
      ContentType: fileType,
      Body: body,
    });

    await this.client.send(putObjectCommand);

    return {
      url: uniqueFileName,
    };
  }
}
