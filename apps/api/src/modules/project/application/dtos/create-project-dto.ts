import { Dto } from "@/core/entity/dto";

interface CreateProjectProps {
  ownerAccountId: string;
  name: string;
  description: string | null;
  dueDate: Date | null;
}

export class CreateProjectDto extends Dto<CreateProjectProps> {
  public get ownerAccountId() {
    return this.props.ownerAccountId;
  }

  public get name() {
    return this.props.name;
  }

  public get description() {
    return this.props.description;
  }

  public get dueDate() {
    return this.props.dueDate;
  }

  public static create(props: CreateProjectProps) {
    return new CreateProjectDto(props);
  }
}
