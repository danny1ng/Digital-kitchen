/*
  Warnings:

  - A unique constraint covering the columns `[guid]` on the table `Menu` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guid]` on the table `MenuGroup` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Menu_guid_key" ON "Menu"("guid");

-- CreateIndex
CREATE UNIQUE INDEX "MenuGroup_guid_key" ON "MenuGroup"("guid");
