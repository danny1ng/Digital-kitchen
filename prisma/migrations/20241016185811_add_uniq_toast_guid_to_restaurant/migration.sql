/*
  Warnings:

  - A unique constraint covering the columns `[toastGuid]` on the table `Restaurant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_toastGuid_key" ON "Restaurant"("toastGuid");
