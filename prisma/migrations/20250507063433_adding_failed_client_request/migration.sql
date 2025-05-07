-- CreateTable
CREATE TABLE "failed_client_request" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "data" JSONB,
    "totalTry" INTEGER NOT NULL,
    "lastTry" TIMESTAMP(3),
    "appVersion" TEXT,
    "deviceId" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "failed_client_request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "failed_client_request" ADD CONSTRAINT "failed_client_request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
