import { container } from "tsyringe";

import { OnMemberIsAddedToProject } from "@/modules/notification/subscribers/on-member-is-added-to-project";

export class Events {
  public constructor() {
    container.resolve(OnMemberIsAddedToProject).startSubscriber();
  }
}
