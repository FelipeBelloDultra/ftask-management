/*
  Warnings:

  - Added the required column `icon_url` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "picture_url" TEXT;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "icon_url" TEXT NOT NULL;
