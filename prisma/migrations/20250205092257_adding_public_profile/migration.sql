-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

-- CreateTable
CREATE TABLE "profile" (
    "id" UUID NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "full_name" TEXT,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);
