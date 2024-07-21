import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { ProjectMember, ProjectMemberProps } from "~/project/domain/entity/project-member";

export function makeProjectMember(override: Partial<ProjectMemberProps> = {}): ProjectMember {
  const projectMember = ProjectMember.create({
    memberId: UniqueEntityID.create(),
    projectId: UniqueEntityID.create(),
    ...override,
  });

  return projectMember;
}
