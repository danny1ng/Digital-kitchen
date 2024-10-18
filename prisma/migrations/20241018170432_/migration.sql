/*
  Warnings:

  - A unique constraint covering the columns `[guid]` on the table `MenuItem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MenuItem" ALTER COLUMN "inheritPricing" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_guid_key" ON "MenuItem"("guid");
