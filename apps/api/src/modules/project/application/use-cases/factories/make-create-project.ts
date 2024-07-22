import { container } from "tsyringe";

import { CreateProjectUseCase } from "../create-project.use-case";

export function makeCreateProject() {
  const createProject = container.resolve(CreateProjectUseCase);

  return createProject;
}
