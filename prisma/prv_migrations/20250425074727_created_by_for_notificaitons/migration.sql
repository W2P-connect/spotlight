-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "createdBy" UUID,
ADD COLUMN     "profileId" UUID;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
