import { makeAccount } from "~/test/factories/make-account";
import { makeOwner } from "~/test/factories/make-owner";
import { makeProject } from "~/test/factories/make-project";
import { FakeAccountRepository } from "~/test/repositories/fake-account.repository";
import { FakeOwnerRepository } from "~/test/repositories/fake-owner.repository";
import { FakeProjectRepository } from "~/test/repositories/fake-project.repository";

import { CreateProjectUseCase } from "./create-project.use-case";
import { AccountNotFoundError } from "./errors/account-not-found.error";
import { DuplicatedProjectSlugError } from "./errors/duplicated-project-slug.error";

describe("CreateProjectUseCase", () => {
  let sut: CreateProjectUseCase;
  let fakeProjectRepository: FakeProjectRepository;
  let fakeAccountRepository: FakeAccountRepository;
  let fakeOwnerRepository: FakeOwnerRepository;

  beforeEach(() => {
    fakeProjectRepository = new FakeProjectRepository();
    fakeAccountRepository = new FakeAccountRepository();
    fakeOwnerRepository = new FakeOwnerRepository();

    sut = new CreateProjectUseCase(fakeProjectRepository, fakeAccountRepository, fakeOwnerRepository);
  });

  it("should create new project and create owner for this one", async () => {
    const account = makeAccount();

    await fakeAccountRepository.create(account);

    const input = {
      ownerAccountId: account.id.toValue(),
      name: "Project name",
      description: "Project description",
      dueDate: new Date("2000-01-01T08:00:00"),
    };

    const result = await sut.execute(input);

    expect(result.isRight()).toBeTruthy();
    expect(fakeProjectRepository.projects.length).toBe(1);
    expect(fakeOwnerRepository.owners.length).toBe(1);
    expect(fakeOwnerRepository.owners[0].values.accountId.equals(account.id)).toBeTruthy();
  });

  it("should create new project and use older owner", async () => {
    const account = makeAccount();
    const owner = makeOwner({
      accountId: account.id,
    });

    await fakeAccountRepository.create(account);
    await fakeOwnerRepository.create(owner);

    const input = {
      ownerAccountId: account.id.toValue(),
      name: "Project name",
      description: "Project description",
      dueDate: null,
    };

    const result = await sut.execute(input);

    expect(result.isRight()).toBeTruthy();
    expect(fakeProjectRepository.projects.length).toBe(1);
    expect(fakeOwnerRepository.owners.length).toBe(1);
    expect(fakeOwnerRepository.owners[0].values.accountId.equals(account.id)).toBeTruthy();
  });

  it("should not be able to create project with duplicated slug", async () => {
    const account = makeAccount();
    const project = makeProject({
      name: "Project name",
    });

    await fakeAccountRepository.create(account);
    await fakeProjectRepository.create(project);

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
