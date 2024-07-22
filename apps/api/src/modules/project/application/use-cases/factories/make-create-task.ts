import { container } from "tsyringe";

import { CreateTaskUseCase } from "../create-task.use-case";

export function makeCreateTask() {
  const createTask = container.resolve(CreateTaskUseCase);

  return createTask;
}
