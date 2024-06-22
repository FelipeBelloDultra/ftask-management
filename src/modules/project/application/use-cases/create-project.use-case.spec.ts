import { FakeProjectRepository } from "test/repositories/fake-project.repository";
import { FakeAccountRepository } from "test/repositories/fake-account.repository";
import { FakeOwnerRepository } from "test/repositories/fake-owner.repository";
import { makeAccount } from "test/factories/make-account";
import { makeOwner } from "test/factories/make-owner";
import { makeProject } from "test/factories/make-project";

import { CreateProjectUseCase } from "./create-project.use-case";
import { DuplicatedProjectSlug } from "./errors/duplicated-project-slug.error";
import { AccountNotFound } from "./errors/account-not-found.error";

describe("CreateProjectUseCase", () => {
  let sut: CreateProjectUseCase;
  let projectRepository: FakeProjectRepository;
  let accountRepository: FakeAccountRepository;
  let ownerRepository: FakeOwnerRepository;

  beforeEach(() => {
    projectRepository = new FakeProjectRepository();
    accountRepository = new FakeAccountRepository();
    ownerRepository = new FakeOwnerRepository();

    sut = new CreateProjectUseCase(projectRepository, accountRepository, ownerRepository);
  });

  it("should create new project and create owner for this one", async () => {
    const account = makeAccount();

    await accountRepository.create(account);

    const input = {
      accountId: account.id.toValue(),
      name: "Project name",
      description: "Project description",
      dueDate: new Date("2000-01-01T08:00:00"),
    };

    const result = await sut.execute(input);

    expect(result.isRight()).toBeTruthy();
    expect(projectRepository.projects.length).toBe(1);
    expect(ownerRepository.owners.length).toBe(1);
    expect(ownerRepository.owners[0].values.accountId.equals(account.id)).toBeTruthy();
  });

  it("should create new project and use older owner", async () => {
    const account = makeAccount();
    const owner = makeOwner({
      accountId: account.id,
    });

    await accountRepository.create(account);
    await ownerRepository.create(owner);

    const input = {
      accountId: account.id.toValue(),
      name: "Project name",
      description: "Project description",
      dueDate: null,
    };

    const result = await sut.execute(input);

    expect(result.isRight()).toBeTruthy();
    expect(projectRepository.projects.length).toBe(1);
    expect(ownerRepository.owners.length).toBe(1);
    expect(ownerRepository.owners[0].values.accountId.equals(account.id)).toBeTruthy();
  });

  it("should not be able to create project with duplicated slug", async () => {
    const account = makeAccount();
    const project = makeProject({
      name: "Project name",
    });

    await accountRepository.create(account);
    await projectRepository.create(project);

    const input = {
      accountId: account.id.toValue(),
      name: "Project name",
      description: "Project description",
      dueDate: null,
    };

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(DuplicatedProjectSlug);
  });

  it("should not be able to create project with invalid account", async () => {
    const input = {
      accountId: "invalid-id",
      name: "Project name",
      description: "Project description",
      dueDate: null,
    };

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(AccountNotFound);
  });
});
