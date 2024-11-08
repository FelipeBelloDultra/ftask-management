/*
  Warnings:

  - You are about to drop the column `participant_id` on the `project_invites` table. All the data in the column will be lost.
  - Added the required column `member_id` to the `project_invites` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_id` to the `project_invites` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "project_invites" DROP CONSTRAINT "project_invites_participant_id_fkey";

-- AlterTable
ALTER TABLE "project_invites" DROP COLUMN "participant_id",
ADD COLUMN     "member_id" TEXT NOT NULL,
ADD COLUMN     "project_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "project_invites" ADD CONSTRAINT "project_invites_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_invites" ADD CONSTRAINT "project_invites_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
