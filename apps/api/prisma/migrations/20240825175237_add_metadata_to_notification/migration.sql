-- CreateTable
CREATE TABLE "notifications_metadata" (
    "id" TEXT NOT NULL,
    "notification_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "Value" TEXT NOT NULL,

    CONSTRAINT "notifications_metadata_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notifications_metadata" ADD CONSTRAINT "notifications_metadata_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
