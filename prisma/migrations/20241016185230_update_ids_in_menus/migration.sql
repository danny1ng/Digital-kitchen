/*
  Warnings:

  - The primary key for the `Menu` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MenuGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MenuItem` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "MenuGroup" DROP CONSTRAINT "MenuGroup_menuId_fkey";

-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_menuGroupId_fkey";

-- AlterTable
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Menu_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Menu_id_seq";

-- AlterTable
ALTER TABLE "MenuGroup" DROP CONSTRAINT "MenuGroup_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "menuId" DROP NOT NULL,
ALTER COLUMN "menuId" SET DATA TYPE TEXT,
ADD CONSTRAINT "MenuGroup_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "MenuGroup_id_seq";

-- AlterTable
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "menuGroupId" DROP NOT NULL,
ALTER COLUMN "menuGroupId" SET DATA TYPE TEXT,
ADD CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "MenuItem_id_seq";

-- AddForeignKey
ALTER TABLE "MenuGroup" ADD CONSTRAINT "MenuGroup_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_menuGroupId_fkey" FOREIGN KEY ("menuGroupId") REFERENCES "MenuGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
