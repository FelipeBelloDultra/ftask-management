import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { makeAccount } from "@/test/factories/make-account";
import { makeProject } from "@/test/factories/make-project";

import { DueDate } from "./due-date";
import { InvitationStatus } from "./invitation-status";
import { InviteDetail } from "./invite-detail";

describe("InviteDetail", () => {
  it("should create an invite detail instance", () => {
    const props = {
      createdAt: new Date(),
      expirationDate: DueDate.create(new Date()),
      id: UniqueEntityID.create(),
      member: makeAccount(),
      project: makeProject(),
      status: InvitationStatus.create(),
    };
    const inviteDetail = InviteDetail.create(props);

    expect(inviteDetail).toBeInstanceOf(InviteDetail);
    expect(inviteDetail.id).toEqual(props.id);
    expect(inviteDetail.project).toEqual(props.project);
    expect(inviteDetail.member).toEqual(props.member);
    expect(inviteDetail.expirationDate).toEqual(props.expirationDate);
    expect(inviteDetail.status).toEqual(props.status);
    expect(inviteDetail.createdAt).toEqual(props.createdAt);
  });
});
