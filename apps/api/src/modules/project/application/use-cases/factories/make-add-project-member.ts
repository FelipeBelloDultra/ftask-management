import { container } from "tsyringe";

import { AddProjectMemberUseCase } from "../add-project-member.use-case";

export function makeAddProjectMember() {
  const addProjectMember = container.resolve(AddProjectMemberUseCase);

  return addProjectMember;
}
