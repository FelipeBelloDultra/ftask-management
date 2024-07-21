/*
  Warnings:

  - You are about to drop the column `project_id` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `members` table. All the data in the column will be lost.
  - You are about to drop the `owners` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_project_id_fkey";

-- DropForeignKey
ALTER TABLE "owners" DROP CONSTRAINT "owners_account_id_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_owner_id_fkey";

-- DropIndex
DROP INDEX "members_project_id_account_id_key";

-- AlterTable
ALTER TABLE "members" DROP COLUMN "project_id",
DROP COLUMN "role";

-- DropTable
DROP TABLE "owners";

-- DropEnum
DROP TYPE "Roles";

-- CreateTable
CREATE TABLE "project_has_member" (
    "project_id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,

    CONSTRAINT "project_has_member_pkey" PRIMARY KEY ("project_id","member_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "project_has_member" ADD CONSTRAINT "project_has_member_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_has_member" ADD CONSTRAINT "project_has_member_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
