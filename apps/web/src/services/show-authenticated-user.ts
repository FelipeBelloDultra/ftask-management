import { fetchAdapter } from "@/infra/adapter/fetch-adapter-http";
import { PersistenceUser, UserMapper } from "@/infra/mappers/user-mapper";

import { SHOW_AUTHENTICATED_USER } from "./endpoints";

export async function showAuthenticatedUserService() {
  const response = await fetchAdapter.get<PersistenceUser>(SHOW_AUTHENTICATED_USER);

  return UserMapper.toDomain(response);
}
