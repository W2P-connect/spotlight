-- CreateEnum
CREATE TYPE "ErrorLevel" AS ENUM ('error', 'warning');

-- CreateTable
CREATE TABLE "error_log" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "level" "ErrorLevel" NOT NULL,
    "message" TEXT NOT NULL,
    "stack_trace" TEXT NOT NULL,
    "endpoint" TEXT,
    "request_id" TEXT,
    "user_id" INTEGER,
    "metadata" JSONB,
    "environment" TEXT NOT NULL DEFAULT 'production',
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "error_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "error_log_createdAt_idx" ON "error_log"("createdAt");

-- CreateIndex
CREATE INDEX "error_log_user_id_idx" ON "error_log"("user_id");

-- CreateIndex
CREATE INDEX "error_log_level_idx" ON "error_log"("level");
