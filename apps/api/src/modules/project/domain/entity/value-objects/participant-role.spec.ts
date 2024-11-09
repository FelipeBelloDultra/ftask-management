import { ParticipantRole, ParticipantRoleValues } from "./participant-role";

describe("ParticipantRole", () => {
  it("should create a participant role as default role", () => {
    const role = ParticipantRole.create();
    expect(role.value).toBe(ParticipantRoleValues.Member);
  });

  it("should create a participant role as owner", () => {
    const role = ParticipantRole.createAsOwner();
    expect(role.value).toBe(ParticipantRoleValues.Owner);
  });
});
