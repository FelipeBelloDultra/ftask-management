/*
  Warnings:

  - The primary key for the `project_has_member` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[project_id,member_id]` on the table `project_has_member` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `project_has_member` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "project_has_member" DROP CONSTRAINT "project_has_member_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "project_has_member_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "project_has_member_project_id_member_id_key" ON "project_has_member"("project_id", "member_id");
