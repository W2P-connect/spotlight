/*
  Warnings:

  - You are about to alter the column `content` on the `comment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2200)`.

*/
-- AlterTable
ALTER TABLE "comment" ALTER COLUMN "content" SET DATA TYPE VARCHAR(2200);
