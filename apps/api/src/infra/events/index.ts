import { makeOnNewAccountIsCreated } from "@/modules/notification/subscribers/factories/make-on-new-account-is-created";
import { makeOnProjectInviteWasCreated } from "@/modules/notification/subscribers/factories/make-on-project-invite-was-created";

export class Events {
  public constructor() {
    makeOnProjectInviteWasCreated();
    makeOnNewAccountIsCreated();
  }
}
