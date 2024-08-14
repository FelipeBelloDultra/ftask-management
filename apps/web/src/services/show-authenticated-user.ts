import { fetchAdapter } from "@/infra/adapter/fetch-adapter-http";

import { SHOW_AUTHENTICATED_USER } from "./endpoints";

interface ShowAuthenticatedUserServiceResponse {
  id: string;
  picture_url: string | null;
  email: string;
  name: string;
}

export async function showAuthenticatedUserService() {
  const response = await fetchAdapter.get<ShowAuthenticatedUserServiceResponse>(SHOW_AUTHENTICATED_USER);

  return {
    id: response.id,
    pictureUrl: response.picture_url,
    email: response.email,
    name: response.name,
  };
}
