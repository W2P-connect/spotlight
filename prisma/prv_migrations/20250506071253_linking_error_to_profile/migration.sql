/*
  Warnings:

  - The `user_id` column on the `error_log` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "error_log" DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID;

-- CreateIndex
CREATE INDEX "error_log_user_id_idx" ON "error_log"("user_id");

-- AddForeignKey
ALTER TABLE "error_log" ADD CONSTRAINT "error_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
