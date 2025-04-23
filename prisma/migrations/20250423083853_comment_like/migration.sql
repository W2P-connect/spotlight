-- AlterTable
ALTER TABLE "comment" ADD COLUMN     "likesCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "comment_like" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "commentId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "comment_like_userId_commentId_key" ON "comment_like"("userId", "commentId");

-- AddForeignKey
ALTER TABLE "comment_like" ADD CONSTRAINT "comment_like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_like" ADD CONSTRAINT "comment_like_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
