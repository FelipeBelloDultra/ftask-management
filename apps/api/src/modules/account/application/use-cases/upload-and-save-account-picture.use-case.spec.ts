import { Right } from "@/core/either";
import { Account } from "@/modules/account/domain/entity/account";
import { AccountNotFoundError } from "@/modules/project/application/use-cases/errors/account-not-found.error";
import { makeAccount } from "@/test/factories/make-account";
import { FakeStorageProvider } from "@/test/providers/fake-storage.provider";
import { InMemoryAccountRepository } from "@/test/repositories/in-memory-account.repository";

import { InvalidAccountPictureTypeError } from "./errors/invalid-account-picture-type.error";
import { UploadAndSaveAccountPictureUseCase } from "./upload-and-save-account-picture.use-case";

describe("UploadAndSaveAccountPictureUseCase", () => {
  let sut: UploadAndSaveAccountPictureUseCase;
  let inMemoryAccountRepository: InMemoryAccountRepository;
  let fakeStorageProvider: FakeStorageProvider;

  beforeEach(() => {
    inMemoryAccountRepository = new InMemoryAccountRepository();
    fakeStorageProvider = new FakeStorageProvider();
    sut = new UploadAndSaveAccountPictureUseCase(inMemoryAccountRepository, fakeStorageProvider);
  });

  it("should update account profile picture", async () => {
    const account = makeAccount();
    await inMemoryAccountRepository.create(account);

    const result = (await sut.execute({
      accountId: account.id.toValue(),
      fileName: "profile.png",
      fileType: "image/png",
      body: Buffer.from(""),
    })) as Right<never, { account: Account }>;

    expect(result.isRight()).toBeTruthy();
    expect(result.value.account.pictureUrl?.value).toBeDefined();
  });

  it("should not be able to change profile picture if account does not exist", async () => {
    const result = await sut.execute({
      accountId: "invalid-id",
      fileName: "profile.png",
      fileType: "image/png",
      body: Buffer.from(""),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(AccountNotFoundError);
  });

  it("should not be able to change profile picture if file type is invalid", async () => {
    const result = await sut.execute({
      accountId: "id",
      fileName: "profile.mp3",
      fileType: "audio/mpeg",
      body: Buffer.from(""),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidAccountPictureTypeError);
  });
});
