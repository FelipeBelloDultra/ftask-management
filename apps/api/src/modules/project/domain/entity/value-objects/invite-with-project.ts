import { ValueObject } from "@/core/entity/value-object";

import { Invite } from "../invite";

import { IconUrl } from "./icon-url";
import { Slug } from "./slug";

interface InviteWithProjectProps {
  invite: Invite;
  project: {
    createdAt: Date;
    slug: Slug;
    iconUrl: IconUrl | null;
    name: string;
    description: string | null;
  };
}

export class InviteWithProject extends ValueObject<InviteWithProjectProps> {
  public get invite() {
    return this.props.invite;
  }

  public get project() {
    return this.props.project;
  }

  public static create(props: InviteWithProjectProps) {
    return new InviteWithProject(props);
  }
}
