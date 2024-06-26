import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Project } from "~/project/domain/entity/project";

import type { ProjectProps } from "~/project/domain/entity/project";

export function makeProject(override: Partial<ProjectProps> = {}, id?: UniqueEntityID): Project {
  const project = Project.create(
    {
      description: faker.lorem.paragraph(),
      dueDate: null,
      name: faker.lorem.words(4),
      ownerId: UniqueEntityID.create(),
      ...override,
    },
    id,
  );

  return project;
}
