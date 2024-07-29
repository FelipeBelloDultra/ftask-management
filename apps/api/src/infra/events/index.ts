import { makeOnMemberIsAddedToProject } from "@/modules/notification/subscribers/factories/make-on-member-is-added-to-project";

export class Events {
  public constructor() {
    makeOnMemberIsAddedToProject();
  }
}
