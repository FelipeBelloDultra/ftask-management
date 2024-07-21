/*
  Warnings:

  - You are about to drop the column `account_id` on the `members` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,account_email]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `account_email` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_account_id_fkey";

-- AlterTable
ALTER TABLE "members" DROP COLUMN "account_id",
ADD COLUMN     "account_email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "members_id_account_email_key" ON "members"("id", "account_email");

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_account_email_fkey" FOREIGN KEY ("account_email") REFERENCES "accounts"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
