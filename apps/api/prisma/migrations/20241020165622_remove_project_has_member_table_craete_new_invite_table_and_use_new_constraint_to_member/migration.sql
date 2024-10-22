/*
  Warnings:

  - You are about to drop the `project_has_member` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[account_id,project_id]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `project_id` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "project_has_member" DROP CONSTRAINT "project_has_member_member_id_fkey";

-- DropForeignKey
ALTER TABLE "project_has_member" DROP CONSTRAINT "project_has_member_project_id_fkey";

-- DropIndex
DROP INDEX "members_id_account_id_key";

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "project_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "project_has_member";

-- CreateTable
CREATE TABLE "project_invites" (
    "id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'pending',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_account_id_project_id_key" ON "members"("account_id", "project_id");

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_invites" ADD CONSTRAINT "project_invites_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_invites" ADD CONSTRAINT "project_invites_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
