import { User } from "@/domain/user";
import { fetchAdapter } from "@/infra/adapter/fetch-adapter-http";
import { PersistenceUser, UserMapper } from "@/infra/mappers/user-mapper";

import { CREATE_USER } from "./endpoints";

interface CreateUserParams {
  email: string;
  password: string;
  name: string;
}

interface CreateUserResponse {
  user: User;
}

export async function createUserService(data: CreateUserParams): Promise<CreateUserResponse> {
  const response = await fetchAdapter.post<PersistenceUser>(CREATE_USER, data);

  return {
    user: UserMapper.toDomain({
      picture_url: response.picture_url,
      email: response.email,
      name: response.name,
      id: response.id,
    }),
  };
}