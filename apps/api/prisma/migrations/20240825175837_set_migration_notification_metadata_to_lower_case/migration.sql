/*
  Warnings:

  - You are about to drop the column `Value` on the `notifications_metadata` table. All the data in the column will be lost.
  - Added the required column `value` to the `notifications_metadata` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notifications_metadata" DROP COLUMN "Value",
ADD COLUMN     "value" TEXT NOT NULL;
