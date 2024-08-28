import { makeOnMemberIsAddedToProject } from "@/modules/notification/subscribers/factories/make-on-member-is-added-to-project";
import { makeOnNewAccountIsCreated } from "@/modules/notification/subscribers/factories/make-on-new-account-is-created";

export class Events {
  public constructor() {
    makeOnMemberIsAddedToProject();
    makeOnNewAccountIsCreated();
  }
}
