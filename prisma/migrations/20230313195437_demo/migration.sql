/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "History_address_key";

-- CreateIndex
CREATE UNIQUE INDEX "users_address_key" ON "users"("address");
