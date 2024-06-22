/*
  Warnings:

  - A unique constraint covering the columns `[project_id,user_id]` on the table `members` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ProjectInvitesStatus" AS ENUM ('pending', 'expired', 'accepted');

-- CreateTable
CREATE TABLE "project_invites" (
    "id" TEXT NOT NULL,
    "status" "ProjectInvitesStatus" NOT NULL DEFAULT 'pending',
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,

    CONSTRAINT "project_invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_project_id_user_id_key" ON "members"("project_id", "user_id");

-- AddForeignKey
ALTER TABLE "project_invites" ADD CONSTRAINT "project_invites_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_invites" ADD CONSTRAINT "project_invites_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
