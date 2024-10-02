import { Dto } from "@/core/entity/dto";

interface CreateTaskProps {
  dueDate: Date;
  assigneeId: string;
  projectId: string;
  description: string;
  title: string;
  ownerAccountId: string;
}

export class CreateTaskDto extends Dto<CreateTaskProps> {
  public get dueDate() {
    return this.props.dueDate;
  }

  public get assigneeId() {
    return this.props.assigneeId;
  }

  public get projectId() {
    return this.props.projectId;
  }

  public get description() {
    return this.props.description;
  }

  public get title() {
    return this.props.title;
  }

  public get ownerAccountId() {
    return this.props.ownerAccountId;
  }

  public static create(props: CreateTaskProps) {
    return new CreateTaskDto(props);
  }
}
