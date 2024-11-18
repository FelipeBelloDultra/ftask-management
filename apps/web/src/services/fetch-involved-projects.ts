import { httpClientAdapter } from "@/infra/adapter/fetch-adapter-http";
import { HttpMethods } from "@/infra/http";

import { FETCH_INVOLVED_PROJECTS } from "./endpoints";

// TODO::: Implement method mapper
export async function fetchInvolvedProjectsService() {
  const response = await httpClientAdapter.sendRequest({
    method: HttpMethods.GET,
    url: FETCH_INVOLVED_PROJECTS,
  });

  console.log(response);

  return "";
}
