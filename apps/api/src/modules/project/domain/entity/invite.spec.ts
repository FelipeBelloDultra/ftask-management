import { UniqueEntityID } from "@/core/entity/unique-entity-id";

import { Invite } from "./invite";
import { DueDate } from "./value-objects/due-date";
import { InvitationStatus, InvitationStatusValues } from "./value-objects/invitation-status";

describe("Invite", () => {
  const memberId = UniqueEntityID.create("member-id");
  const projectId = UniqueEntityID.create("project-id");

  it("should create an invite with provided properties", () => {
    const expirationDate = DueDate.create(new Date("2024-12-31"));
    const status = InvitationStatus.create();
    const createdAt = new Date("2024-10-20");

    const invite = Invite.create({
      expirationDate,
      memberId,
      projectId,
      status,
      createdAt,
    });

    expect(invite).toBeDefined();
    expect(invite.expirationDate.value).toEqual(new Date("2024-12-31"));
    expect(invite.memberId).toEqual(memberId);
    expect(invite.projectId).toEqual(projectId);
    expect(invite.status.value).toBe(InvitationStatusValues.Pending);
    expect(invite.createdAt).toEqual(createdAt);
  });

  it("should set default expiration date if not provided", () => {
    const invite = Invite.create({
      memberId,
      projectId,
    });

    const expectedExpirationDate = new Date();
    expectedExpirationDate.setDate(expectedExpirationDate.getDate() + 1);

    expect(invite.expirationDate.value.getDate()).toEqual(expectedExpirationDate.getDate());
    expect(invite.expirationDate.value.getMonth()).toEqual(expectedExpirationDate.getMonth());
    expect(invite.expirationDate.value.getFullYear()).toEqual(expectedExpirationDate.getFullYear());
  });

  it("should set default status if not provided", () => {
    const invite = Invite.create({
      memberId,
      projectId,
    });

    expect(invite.status.value).toBe(InvitationStatusValues.Pending);
  });

  it("should set createdAt to current date if not provided", () => {
    const invite = Invite.create({
      memberId,
      projectId,
    });

    const now = new Date();
    const createdAt = invite.createdAt;

    expect(createdAt.getDate()).toBe(now.getDate());
    expect(createdAt.getMonth()).toBe(now.getMonth());
    expect(createdAt.getFullYear()).toBe(now.getFullYear());
  });

  it("should correctly use provided IDs for member and project", () => {
    const invite = Invite.create({
      memberId,
      projectId,
    });

    expect(invite.memberId).toEqual(memberId);
    expect(invite.projectId).toEqual(projectId);
  });
});
