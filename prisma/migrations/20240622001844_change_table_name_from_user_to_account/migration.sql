/*
  Warnings:

  - You are about to drop the column `user_id` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `owners` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[project_id,account_id]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `account_id` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_id` to the `owners` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_user_id_fkey";

-- DropForeignKey
ALTER TABLE "owners" DROP CONSTRAINT "owners_user_id_fkey";

-- DropIndex
DROP INDEX "members_project_id_user_id_key";

-- AlterTable
ALTER TABLE "members" DROP COLUMN "user_id",
ADD COLUMN     "account_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "owners" DROP COLUMN "user_id",
ADD COLUMN     "account_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "members_project_id_account_id_key" ON "members"("project_id", "account_id");

-- AddForeignKey
ALTER TABLE "owners" ADD CONSTRAINT "owners_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
