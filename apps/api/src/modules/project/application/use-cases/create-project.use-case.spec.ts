import { makeAccount } from "@/test/factories/make-account";
import { makeProject } from "@/test/factories/make-project";
import { InMemoryAccountRepository } from "@/test/repositories/in-memory-account.repository";
import { InMemoryProjectRepository } from "@/test/repositories/in-memory-project.repository";

import { CreateProjectUseCase } from "./create-project.use-case";
import { AccountNotFoundError } from "./errors/account-not-found.error";
import { DuplicatedProjectSlugError } from "./errors/duplicated-project-slug.error";

describe("CreateProjectUseCase", () => {
  let sut: CreateProjectUseCase;
  let inMemoryProjectRepository: InMemoryProjectRepository;
  let inMemoryAccountRepository: InMemoryAccountRepository;

  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectRepository();
    inMemoryAccountRepository = new InMemoryAccountRepository();

    sut = new CreateProjectUseCase(inMemoryProjectRepository, inMemoryAccountRepository);
  });

  it("should create new project and create owner for this one", async () => {
    const account = makeAccount();

    await inMemoryAccountRepository.create(account);

    const input = {
      ownerAccountId: account.id.toValue(),
      name: "Project name",
      description: "Project description",
      dueDate: new Date("2000-01-01T08:00:00"),
    };

    const result = await sut.execute(input);

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryProjectRepository.projects.length).toBe(1);
  });

  it("should create new project and use older owner", async () => {
    const account = makeAccount();
    await inMemoryAccountRepository.create(account);

    const input = {
      ownerAccountId: account.id.toValue(),
      name: "Project name",
      description: "Project description",
      dueDate: null,
    };

    const result = await sut.execute(input);

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryProjectRepository.projects.length).toBe(1);
  });

  it("should not be able to create project with duplicated slug", async () => {
    const account = makeAccount();
    const project = makeProject({
      name: "Project name",
    });

    await inMemoryAccountRepository.create(account);
    await inMemoryProjectRepository.create(project);

    const input = {
      ownerAccountId: account.id.toValue(),
      name: "Project name",
      description: "Project description",
      dueDate: null,
    };

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(DuplicatedProjectSlugError);
  });

  it("should not be able to create project with invalid account", async () => {
    const input = {
      ownerAccountId: "invalid-id",
      name: "Project name",
      description: "Project description",
      dueDate: null,
    };

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(AccountNotFoundError);
  });
});
