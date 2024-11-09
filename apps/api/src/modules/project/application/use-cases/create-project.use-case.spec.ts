import { makeAccount } from "@/test/factories/make-account";
import { makeProject } from "@/test/factories/make-project";
import { InMemoryAccountRepository } from "@/test/repositories/in-memory-account.repository";
import { InMemoryParticipantRepository } from "@/test/repositories/in-memory-participant.repository";
import { InMemoryProjectRepository } from "@/test/repositories/in-memory-project.repository";

import { CreateProjectDto } from "../dtos/create-project-dto";

import { CreateProjectUseCase } from "./create-project.use-case";
import { AccountNotFoundError } from "./errors/account-not-found.error";
import { DuplicatedProjectSlugError } from "./errors/duplicated-project-slug.error";

describe("CreateProjectUseCase", () => {
  let sut: CreateProjectUseCase;
  let inMemoryProjectRepository: InMemoryProjectRepository;
  let inMemoryAccountRepository: InMemoryAccountRepository;
  let inMemoryParticipantRepository: InMemoryParticipantRepository;

  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectRepository();
    inMemoryAccountRepository = new InMemoryAccountRepository();
    inMemoryParticipantRepository = new InMemoryParticipantRepository(
      inMemoryProjectRepository,
      inMemoryAccountRepository,
    );

    sut = new CreateProjectUseCase(inMemoryProjectRepository, inMemoryAccountRepository, inMemoryParticipantRepository);
  });

  it("should create new project", async () => {
    const account = makeAccount();
    await inMemoryAccountRepository.create(account);

    const input = CreateProjectDto.create({
      ownerAccountId: account.id.toValue(),
      name: "Project name",
      description: "Project description",
      dueDate: null,
    });

    const result = await sut.execute(input);

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryProjectRepository.projects.length).toBe(1);
    expect(inMemoryParticipantRepository.participants.length).toBe(1);
  });

  it("should create new project with due date", async () => {
    const account = makeAccount();
    const currentDate = new Date();
    await inMemoryAccountRepository.create(account);

    const input = CreateProjectDto.create({
      ownerAccountId: account.id.toValue(),
      name: "Project name",
      description: "Project description",
      dueDate: new Date(currentDate.setMonth(currentDate.getMonth() + 1)),
    });

    const result = await sut.execute(input);

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryProjectRepository.projects.length).toBe(1);
    expect(inMemoryParticipantRepository.participants.length).toBe(1);
    expect(inMemoryProjectRepository.projects[0].dueDate?.value).toBeInstanceOf(Date);
  });

  it("should not be able to create project with duplicated slug", async () => {
    const account = makeAccount();
    const project = makeProject({
      name: "Project name",
    });

    await inMemoryAccountRepository.create(account);
    await inMemoryProjectRepository.create(project);

    const input = CreateProjectDto.create({
      ownerAccountId: account.id.toValue(),
      name: "Project name",
      description: "Project description",
      dueDate: null,
    });

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(DuplicatedProjectSlugError);
  });

  it("should not be able to create project with invalid account", async () => {
    const input = CreateProjectDto.create({
      ownerAccountId: "invalid-id",
      name: "Project name",
      description: "Project description",
      dueDate: null,
    });

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(AccountNotFoundError);
  });
});
