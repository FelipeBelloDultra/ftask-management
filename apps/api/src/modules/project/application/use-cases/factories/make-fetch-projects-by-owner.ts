import { container } from "tsyringe";

import { FetchProjectsByOwnerUseCase } from "../fetch-projects-by-owner.use-case";

export function makeFetchProjectsByOwner() {
  const fetchProjectsByOwner = container.resolve(FetchProjectsByOwnerUseCase);

  return fetchProjectsByOwner;
}
