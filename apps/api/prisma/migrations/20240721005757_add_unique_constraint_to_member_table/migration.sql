/*
  Warnings:

  - A unique constraint covering the columns `[account_id]` on the table `members` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "members_account_id_key" ON "members"("account_id");
