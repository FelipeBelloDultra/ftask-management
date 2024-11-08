import { Right } from "@/core/either";
import { Project } from "@/modules/project/domain/entity/project";
import { makeAccount } from "@/test/factories/make-account";
import { makeProject } from "@/test/factories/make-project";
import { InMemoryProjectRepository } from "@/test/repositories/in-memory-project.repository";

import { FetchProjectsByAccountDto } from "../dtos/fetch-projects-by-account-dto";

import { FetchProjectsByAccountUseCase } from "./fetch-projects-by-account.use-case";

describe("FetchProjectsByAccountUseCase", () => {
  let sut: FetchProjectsByAccountUseCase;
  let inMemoryProjectRepository: InMemoryProjectRepository;

  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectRepository();
    sut = new FetchProjectsByAccountUseCase(inMemoryProjectRepository);
  });

  it("should fetch projects by owner id", async () => {
    const PROJECTS_LENGTH = 21;
    const account = makeAccount();
    const projects = Array.from({ length: PROJECTS_LENGTH }, () => makeProject());

    await Promise.all(projects.map((n) => inMemoryProjectRepository.create(n)));

    const result = (await sut.execute(
      FetchProjectsByAccountDto.create({
        ownerId: account.id.toValue(),
        limit: 10,
        page: 1,
      }),
    )) as Right<never, { projects: Project[]; total: number }>;

    expect(result.isRight()).toBeTruthy();
    expect(result.value.projects.length).toBe(10);
    expect(result.value.total).toBe(PROJECTS_LENGTH);
  });
});
