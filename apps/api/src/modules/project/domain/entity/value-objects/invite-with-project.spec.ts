import { makeInvite } from "@/test/factories/make-invite";
import { makeProject } from "@/test/factories/make-project";

import { InviteWithProject } from "./invite-with-project";

describe("InviteWithProject", () => {
  it("should create an instance of InviteWithProject", () => {
    const project = makeProject();
    const invite = makeInvite({
      projectId: project.id,
    });

    const inviteWithProject = InviteWithProject.create({
      invite,
      project: {
        createdAt: project.createdAt,
        description: project.description,
        iconUrl: project.iconUrl,
        slug: project.slug,
        name: project.name,
      },
    });

    expect(inviteWithProject).toBeInstanceOf(InviteWithProject);
    expect(inviteWithProject.project.createdAt).toBe(project.createdAt);
    expect(inviteWithProject.project.description).toBe(project.description);
    expect(inviteWithProject.project.iconUrl).toBe(project.iconUrl);
    expect(inviteWithProject.project.slug).toBe(project.slug);
    expect(inviteWithProject.project.name).toBe(project.name);
    expect(inviteWithProject.invite).toEqual(invite);
  });
});
