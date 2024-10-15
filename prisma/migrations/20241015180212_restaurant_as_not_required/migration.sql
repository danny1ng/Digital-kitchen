-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_restaurantId_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "restaurantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
