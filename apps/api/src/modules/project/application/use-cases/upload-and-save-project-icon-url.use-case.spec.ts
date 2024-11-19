import { Right } from "@/core/either";
import { InvalidAccountPictureTypeError } from "@/modules/account/application/use-cases/errors/invalid-account-picture-type.error";
import { makeAccount } from "@/test/factories/make-account";
import { makeProject } from "@/test/factories/make-project";
import { FakeStorageProvider } from "@/test/providers/fake-storage.provider";
import { InMemoryProjectRepository } from "@/test/repositories/in-memory-project.repository";

import { Project } from "../../domain/entity/project";
import { UploadAndSaveProjectIconUrlDto } from "../dtos/upload-and-save-project-icon-url-dto";

import { NotAllowedError } from "./errors/not-allowed.error";
import { ProjectNotFoundError } from "./errors/project-not-found.error";
import { UploadAndSaveProjectIconUrlUseCase } from "./upload-and-save-project-icon-url.use-case";

describe("UploadAndSaveProjectIconUrlUseCase", () => {
  let sut: UploadAndSaveProjectIconUrlUseCase;
  let inMemoryProjectRepository: InMemoryProjectRepository;
  let fakeStorageProvider: FakeStorageProvider;

  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectRepository();
    fakeStorageProvider = new FakeStorageProvider();
    sut = new UploadAndSaveProjectIconUrlUseCase(inMemoryProjectRepository, fakeStorageProvider);
  });

  it("should update project icon", async () => {
    const account = makeAccount();
    const project = makeProject({ ownerId: account.id });
    await inMemoryProjectRepository.create(project);

    const result = (await sut.execute(
      UploadAndSaveProjectIconUrlDto.create({
        accountId: account.id.toValue(),
        projectId: project.id.toValue(),
        fileName: "project-icon.png",
        fileType: "image/png",
        body: Buffer.from(""),
      }),
    )) as Right<never, { project: Project }>;

    expect(result.isRight()).toBeTruthy();
    expect(result.value.project.iconUrl?.value).toBeDefined();
  });

  it("should not be able to update project icon url if project does not exist", async () => {
    const account = makeAccount();
    const result = await sut.execute(
      UploadAndSaveProjectIconUrlDto.create({
        accountId: account.id.toValue(),
        projectId: "non-existent-project-id",
        fileName: "project-icon.png",
        fileType: "image/png",
        body: Buffer.from(""),
      }),
    );

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ProjectNotFoundError);
  });

  it("should not be able to update icon url if owner id does not match with account id", async () => {
    const project = makeProject();
    await inMemoryProjectRepository.create(project);

    const result = await sut.execute(
      UploadAndSaveProjectIconUrlDto.create({
        accountId: "non-existent-account-id",
        projectId: project.id.toValue(),
        fileName: "project-icon.png",
        fileType: "image/png",
        body: Buffer.from(""),
      }),
    );

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("should not be able to change project icon if file type is invalid", async () => {
    const result = await sut.execute(
      UploadAndSaveProjectIconUrlDto.create({
        accountId: "id",
        projectId: "id",
        fileName: "profile.mp3",
        fileType: "audio/mpeg",
        body: Buffer.from(""),
      }),
    );

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidAccountPictureTypeError);
  });
});
