/*
  Warnings:

  - You are about to drop the column `account_email` on the `members` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,account_id]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `account_id` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_account_email_fkey";

-- DropIndex
DROP INDEX "members_id_account_email_key";

-- AlterTable
ALTER TABLE "members" DROP COLUMN "account_email",
ADD COLUMN     "account_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "members_id_account_id_key" ON "members"("id", "account_id");

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
