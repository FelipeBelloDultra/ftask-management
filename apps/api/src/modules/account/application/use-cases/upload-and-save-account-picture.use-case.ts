import { inject, injectable } from "tsyringe";

import { UploaderProvider } from "@/application/providers/storage/uploader.provider";
import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entity/unique-entity-id";
import { Account } from "@/modules/account/domain/entity/account";
import { AccountNotFoundError } from "@/modules/project/application/use-cases/errors/account-not-found.error";

import { PictureUrl } from "../../domain/entity/value-objects/picture-url";
import { UploadAndSaveAccountPictureDto } from "../dtos/upload-and-save-account-picture-dto";
import { AccountRepository } from "../repositories/account.repository";

import { InvalidAccountPictureTypeError } from "./errors/invalid-account-picture-type.error";

type OnError = AccountNotFoundError | InvalidAccountPictureTypeError;
type OnSuccess = {
  account: Account;
};
type Output = Either<OnError, OnSuccess>;

@injectable()
export class UploadAndSaveAccountPictureUseCase {
  public constructor(
    @inject("AccountRepository")
    private readonly accountRepository: AccountRepository,
    @inject("UploaderProvider")
    private readonly uploaderProvider: UploaderProvider,
  ) {}

  public async execute(input: UploadAndSaveAccountPictureDto): Promise<Output> {
    if (!/^(image\/(jpeg|png|jpg))$/.test(input.fileType)) {
      return left(new InvalidAccountPictureTypeError(input.fileType));
    }

    const account = await this.accountRepository.findById(UniqueEntityID.create(input.accountId));
    if (!account) {
      return left(new AccountNotFoundError());
    }

    const { url } = await this.uploaderProvider.upload({
      body: input.body,
      fileName: input.fileName,
      fileType: input.fileType,
    });

    account.pictureUrl = PictureUrl.create(url);

    await this.accountRepository.save(account);

    return right({ account });
  }
}
