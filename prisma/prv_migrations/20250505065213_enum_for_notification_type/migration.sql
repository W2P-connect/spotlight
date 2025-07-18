/*
  Warnings:

  - Changed the type of `type` on the `notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('like', 'comment', 'generic', 'follow');

-- AlterTable
ALTER TABLE "notification" DROP COLUMN "type",
ADD COLUMN     "type" "NotificationType" NOT NULL;
