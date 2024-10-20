import { InvitationStatus, InvitationStatusValues } from "./invitation-status";

describe("InvitationStatus", () => {
  it("should create an InvitationStatus with default value 'pending'", () => {
    const status = InvitationStatus.create();
    expect(status.value).toBe(InvitationStatusValues.Pending);
  });

  it("should create an InvitationStatus with a specified value", () => {
    const status = InvitationStatus.create(InvitationStatusValues.Accepted);
    expect(status.value).toBe(InvitationStatusValues.Accepted);
  });

  it("should set status to 'pending'", () => {
    const status = InvitationStatus.create(InvitationStatusValues.Accepted);
    status.setPending();
    expect(status.value).toBe(InvitationStatusValues.Pending);
  });

  it("should set status to 'accepted'", () => {
    const status = InvitationStatus.create();
    status.setAccepted();
    expect(status.value).toBe(InvitationStatusValues.Accepted);
  });

  it("should set status to 'declined'", () => {
    const status = InvitationStatus.create();
    status.setDeclined();
    expect(status.value).toBe(InvitationStatusValues.Declined);
  });

  it("should return true for canAccept if the status is 'pending'", () => {
    const status = InvitationStatus.create();
    expect(status.canAccept()).toBe(true);
  });

  it("should return false for canAccept if the status is 'accepted'", () => {
    const status = InvitationStatus.create(InvitationStatusValues.Accepted);
    expect(status.canAccept()).toBe(false);
  });

  it("should return true for canDecline if the status is 'pending'", () => {
    const status = InvitationStatus.create();
    expect(status.canDecline()).toBe(true);
  });

  it("should return false for canDecline if the status is 'declined'", () => {
    const status = InvitationStatus.create(InvitationStatusValues.Declined);
    expect(status.canDecline()).toBe(false);
  });
});
