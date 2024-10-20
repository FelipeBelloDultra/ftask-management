/*
  Warnings:

  - A unique constraint covering the columns `[member_id,project_id]` on the table `project_invites` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "project_invites_member_id_project_id_key" ON "project_invites"("member_id", "project_id");
