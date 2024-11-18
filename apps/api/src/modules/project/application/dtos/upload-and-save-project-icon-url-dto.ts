import { Dto } from "@/core/entity/dto";

interface UploadAndSaveProjectIconUrlProps {
  accountId: string;
  projectId: string;
  fileName: string;
  fileType: string;
  body: Buffer;
}

export class UploadAndSaveProjectIconUrlDto extends Dto<UploadAndSaveProjectIconUrlProps> {
  public get accountId() {
    return this.props.accountId;
  }

  public get projectId() {
    return this.props.projectId;
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

  public static create(props: UploadAndSaveProjectIconUrlProps) {
    return new UploadAndSaveProjectIconUrlDto(props);
  }
}
