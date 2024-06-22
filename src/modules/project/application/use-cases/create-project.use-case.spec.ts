import { FakeProjectRepository } from "test/repositories/fake-project.repository";
import { FakeUserRepository } from "test/repositories/fake-user.repository";
import { FakeOwnerRepository } from "test/repositories/fake-owner.repository";
import { makeUser } from "test/factories/make-user";
import { makeOwner } from "test/factories/make-owner";
import { makeProject } from "test/factories/make-project";

import { CreateProjectUseCase } from "./create-project.use-case";
import { DuplicatedProjectSlug } from "./errors/duplicated-project-slug.error";
import { AccountNotFound } from "./errors/account-not-found.error";

describe("CreateProjectUseCase", () => {
  let sut: CreateProjectUseCase;
  let projectRepository: FakeProjectRepository;
  let userRepository: FakeUserRepository;
  let ownerRepository: FakeOwnerRepository;

  beforeEach(() => {
    projectRepository = new FakeProjectRepository();
    userRepository = new FakeUserRepository();
    ownerRepository = new FakeOwnerRepository();

    sut = new CreateProjectUseCase(projectRepository, userRepository, ownerRepository);
  });

  it("should create new project and create owner for this one", async () => {
    const user = makeUser();

    await userRepository.create(user);

    const input = {
      userId: user.id.toValue(),
      name: "Project name",
      description: "Project description",
      dueDate: new Date("2000-01-01T08:00:00"),
    };

    const result = await sut.execute(input);

    expect(result.isRight()).toBeTruthy();
    expect(projectRepository.projects.length).toBe(1);
    expect(ownerRepository.owners.length).toBe(1);
    expect(ownerRepository.owners[0].values.userId.equals(user.id)).toBeTruthy();
  });

  it("should create new project and use older owner", async () => {
    const user = makeUser();
    const owner = makeOwner({
      userId: user.id,
    });

    await userRepository.create(user);
    await ownerRepository.create(owner);

    const input = {
      userId: user.id.toValue(),
      name: "Project name",
      description: "Project description",
      dueDate: null,
    };

    const result = await sut.execute(input);

    expect(result.isRight()).toBeTruthy();
    expect(projectRepository.projects.length).toBe(1);
    expect(ownerRepository.owners.length).toBe(1);
    expect(ownerRepository.owners[0].values.userId.equals(user.id)).toBeTruthy();
  });

  it("should not be able to create project with duplicated slug", async () => {
    const user = makeUser();
    const project = makeProject({
      name: "Project name",
    });

    await userRepository.create(user);
    await projectRepository.create(project);

    const input = {
      userId: user.id.toValue(),
      name: "Project name",
      description: "Project description",
      dueDate: null,
    };

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(DuplicatedProjectSlug);
  });

  it("should not be able to create project with invalid user", async () => {
    const input = {
      userId: "invalid-id",
      name: "Project name",
      description: "Project description",
      dueDate: null,
    };

    const result = await sut.execute(input);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(AccountNotFound);
  });
});
