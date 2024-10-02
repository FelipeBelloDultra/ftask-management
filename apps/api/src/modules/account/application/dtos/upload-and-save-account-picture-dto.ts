import { Dto } from "@/core/entity/dto";

interface UploadAndSaveAccountPictureProps {
  accountId: string;
  fileName: string;
  fileType: string;
  body: Buffer;
}

export class UploadAndSaveAccountPictureDto extends Dto<UploadAndSaveAccountPictureProps> {
  public get accountId() {
    return this.props.accountId;
  }

  public get fileName() {
    return this.props.fileName;
  }

  public get fileType() {
    return this.props.fileType;
  }

  public get body() {
    return this.props.body;
  }

  public static create(props: UploadAndSaveAccountPictureProps) {
    return new UploadAndSaveAccountPictureDto(props);
  }
}
