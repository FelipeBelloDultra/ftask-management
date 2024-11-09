import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Account } from "@/modules/account/domain/entity/account";
import { makeAccount } from "@/test/factories/make-account";
import { makeProject } from "@/test/factories/make-project";

import { Project } from "../project";

import { ParticipantDetail } from "./participant-detail";
import { ParticipantRole } from "./participant-role";

describe("ParticipantDetail", () => {
  it("should create a new ParticipantDetail", () => {
    const participantDetail = ParticipantDetail.create({
      id: UniqueEntityID.create(),
      account: makeAccount(),
      project: makeProject(),
      role: ParticipantRole.create(),
    });

    expect(participantDetail.id).toBeInstanceOf(UniqueEntityID);
    expect(participantDetail.account).toBeInstanceOf(Account);
    expect(participantDetail.project).toBeInstanceOf(Project);
    expect(participantDetail.role).toBeInstanceOf(ParticipantRole);
  });
});
