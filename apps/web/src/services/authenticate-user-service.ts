import { httpClientAdapter } from "@/infra/adapter/fetch-adapter-http";
import { HttpMethods } from "@/infra/http";

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
  const response = await httpClientAdapter.sendRequest<{ token: string }, AuthenticateUserServiceParams>({
    method: HttpMethods.POST,
    url: AUTHENTICATE_USER,
    body: data,
  });

  return response;
}
