import { fetchAdapter } from "@/infra/adapter/fetch-adapter-http";

import { AUTHENTICATE_USER } from "./endpoints";

interface AuthenticateUserServiceParams {
  email: string;
  password: string;
}

interface AuthenticateUserServiceResponse {
  token: string;
}

export async function authenticateUserService(
  data: AuthenticateUserServiceParams,
): Promise<AuthenticateUserServiceResponse> {
  const response = await fetchAdapter.post<{ token: string }>(AUTHENTICATE_USER, data);

  return response;
}
