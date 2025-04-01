-- AlterTable
ALTER TABLE "exercise" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
