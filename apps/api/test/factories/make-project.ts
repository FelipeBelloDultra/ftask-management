import { faker } from "@faker-js/faker";
import { inject, injectable } from "tsyringe";

import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { ProjectMapper } from "@/infra/database/prisma/mappers/project-mapper";
import { PrismaConnection } from "@/infra/database/prisma/prisma-connection";
import { Project, ProjectProps } from "@/modules/project/domain/entity/project";

export function makeProject(override: Partial<ProjectProps> = {}, id?: UniqueEntityID): Project {
  const project = Project.create(
    {
      description: faker.lorem.paragraph(),
      dueDate: null,
      name: faker.lorem.words(4),
      ...override,
    },
    id,
  );

  return project;
}

@injectable()
export class ProjectFactory {
  public constructor(
    @inject("PrismaConnection")
    private readonly prismaConnection: PrismaConnection,
  ) {}

  public async makePrismaProject(override: Partial<ProjectProps> = {}, id?: UniqueEntityID) {
    const project = makeProject(override, id);

    await this.prismaConnection.project.create({
      data: ProjectMapper.toPersistence(project),
    });

    return project;
  }
}
