/*
  Warnings:

  - Added the required column `owner_id` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "owner_id" TEXT NOT NULL;
