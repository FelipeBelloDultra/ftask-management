import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { makeAccount } from "@/test/factories/make-account";
import { makeProject } from "@/test/factories/make-project";

import { Participant } from "./participant";

describe("Participant", () => {
  it("should create an participant with provided properties", () => {
    const account = makeAccount();
    const project = makeProject();
    const participant = Participant.create({
      accountId: account.id,
      projectId: project.id,
    });

    expect(participant.id).toBeInstanceOf(UniqueEntityID);
    expect(participant.accountId.toValue()).toEqual(account.id.toValue());
    expect(participant.projectId.toValue()).toEqual(project.id.toValue());
  });
});
