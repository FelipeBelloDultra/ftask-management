import { inject, injectable } from "tsyringe";

import { UploaderProvider } from "@/application/providers/storage/uploader.provider";
import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { InvalidAccountPictureTypeError } from "@/modules/account/application/use-cases/errors/invalid-account-picture-type.error";

import { Project } from "../../domain/entity/project";
import { IconUrl } from "../../domain/entity/value-objects/icon-url";
import { UploadAndSaveProjectIconUrlDto } from "../dtos/upload-and-save-project-icon-url-dto";
import { ProjectRepository } from "../repositories/project.repository";

import { NotAllowedError } from "./errors/not-allowed.error";
import { ProjectNotFoundError } from "./errors/project-not-found.error";

type OnError = InvalidAccountPictureTypeError | NotAllowedError | ProjectNotFoundError;
type OnSuccess = {
  project: Project;
};
type Output = Either<OnError, OnSuccess>;

@injectable()
export class UploadAndSaveProjectIconUrlUseCase {
  public constructor(
    @inject("ProjectRepository")
    private readonly projectRepository: ProjectRepository,
    @inject("UploaderProvider")
    private readonly uploaderProvider: UploaderProvider,
  ) {}

  public async execute(input: UploadAndSaveProjectIconUrlDto): Promise<Output> {
    if (!/^(image\/(jpeg|png|jpg))$/.test(input.fileType)) {
      return left(new InvalidAccountPictureTypeError(input.fileType));
    }

    const projectId = UniqueEntityID.create(input.projectId);
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      return left(new ProjectNotFoundError());
    }

    const accountId = UniqueEntityID.create(input.accountId);
    if (!project.ownerId.equals(accountId)) {
      return left(new NotAllowedError());
    }

    const { url } = await this.uploaderProvider.upload({
      body: input.body,
      fileName: input.fileName,
      fileType: input.fileType,
    });

    project.iconUrl = IconUrl.create(url);

    await this.projectRepository.save(project);

    return right({ project });
  }
}
