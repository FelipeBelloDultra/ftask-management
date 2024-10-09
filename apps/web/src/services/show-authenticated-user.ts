import { httpClientAdapter } from "@/infra/adapter/fetch-adapter-http";
import { HttpMethods } from "@/infra/http";
import { PersistenceUser, UserMapper } from "@/infra/mappers/user-mapper";

import { SHOW_AUTHENTICATED_USER } from "./endpoints";

export async function showAuthenticatedUserService() {
  const response = await httpClientAdapter.sendRequest<PersistenceUser>({
    url: SHOW_AUTHENTICATED_USER,
    method: HttpMethods.GET,
  });

  return UserMapper.toDomain(response);
}
