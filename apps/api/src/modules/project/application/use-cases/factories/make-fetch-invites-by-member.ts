import { container } from "tsyringe";

import { FetchInvitesByMemberUseCase } from "../fetch-invites-by-member.use-case";

export function makeFetchInvitesByMember() {
  const fetchInvitesByMember = container.resolve(FetchInvitesByMemberUseCase);

  return fetchInvitesByMember;
}
