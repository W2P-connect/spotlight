/*
  Warnings:

  - You are about to drop the column `profileId` on the `notification` table. All the data in the column will be lost.
  - Made the column `createdBy` on table `notification` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_createdBy_fkey";

-- AlterTable
ALTER TABLE "notification" DROP COLUMN "profileId",
ALTER COLUMN "createdBy" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
