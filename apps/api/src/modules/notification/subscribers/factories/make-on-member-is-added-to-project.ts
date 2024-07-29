import { container } from "tsyringe";

import { OnMemberIsAddedToProject } from "../on-member-is-added-to-project";

export function makeOnMemberIsAddedToProject() {
  const onMemberIsAddedToProject = container.resolve(OnMemberIsAddedToProject);

  return onMemberIsAddedToProject;
}
