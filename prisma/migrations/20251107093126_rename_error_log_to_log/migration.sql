-- AlterEnum: Add 'log' to ErrorLevel enum
ALTER TYPE "ErrorLevel" ADD VALUE IF NOT EXISTS 'log';

-- RenameTable: error_log -> log
ALTER TABLE "error_log" RENAME TO "log";

-- RenameIndex: error_log_createdAt_idx -> log_createdAt_idx
ALTER INDEX "error_log_createdAt_idx" RENAME TO "log_createdAt_idx";

-- RenameIndex: error_log_user_id_idx -> log_user_id_idx
ALTER INDEX "error_log_user_id_idx" RENAME TO "log_user_id_idx";

-- RenameIndex: error_log_level_idx -> log_level_idx
ALTER INDEX "error_log_level_idx" RENAME TO "log_level_idx";

-- RenameConstraint: error_log_pkey -> log_pkey
ALTER TABLE "log" RENAME CONSTRAINT "error_log_pkey" TO "log_pkey";

