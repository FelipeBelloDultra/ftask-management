/*
  Warnings:

  - You are about to drop the column `member_id` on the `project_invites` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `project_invites` table. All the data in the column will be lost.
  - You are about to drop the column `owner_id` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the `members` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `participant_id` to the `project_invites` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('owner', 'member');

-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_account_id_fkey";

-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_project_id_fkey";

-- DropForeignKey
ALTER TABLE "project_invites" DROP CONSTRAINT "project_invites_member_id_fkey";

-- DropForeignKey
ALTER TABLE "project_invites" DROP CONSTRAINT "project_invites_project_id_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_assignee_id_fkey";

-- AlterTable
ALTER TABLE "project_invites" DROP COLUMN "member_id",
DROP COLUMN "project_id",
ADD COLUMN     "participant_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "owner_id";

-- DropTable
DROP TABLE "members";

-- CreateTable
CREATE TABLE "participants" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "role" "ParticipantRole" NOT NULL DEFAULT 'member',

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "participants_account_id_project_id_key" ON "participants"("account_id", "project_id");

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_invites" ADD CONSTRAINT "project_invites_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
