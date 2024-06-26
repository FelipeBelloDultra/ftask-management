/*
  Warnings:

  - You are about to drop the `project_invites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "project_invites" DROP CONSTRAINT "project_invites_member_id_fkey";

-- DropForeignKey
ALTER TABLE "project_invites" DROP CONSTRAINT "project_invites_project_id_fkey";

-- DropTable
DROP TABLE "project_invites";

-- DropEnum
DROP TYPE "ProjectInvitesStatus";
