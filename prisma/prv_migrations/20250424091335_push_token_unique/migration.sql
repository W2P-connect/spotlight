/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `push_token` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "push_token_token_key" ON "push_token"("token");
