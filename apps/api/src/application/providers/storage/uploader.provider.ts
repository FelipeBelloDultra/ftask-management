export interface UploadParams {
  fileName: string;
  fileType: string;
  body: Buffer;
}

export interface UploaderProvider {
  upload(params: UploadParams): Promise<{ url: string }>;
}
