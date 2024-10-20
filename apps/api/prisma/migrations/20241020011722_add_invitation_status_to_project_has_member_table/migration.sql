-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('pending', 'accepted', 'declined');

-- AlterTable
ALTER TABLE "project_has_member" ADD COLUMN     "invitation_status" "InvitationStatus" NOT NULL DEFAULT 'pending';
