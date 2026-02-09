/*
  Warnings:

  - You are about to drop the column `adminToken` on the `Client` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Client_adminToken_key";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "adminToken",
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "currentBalance" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "hourlyRate" DECIMAL(10,2) NOT NULL DEFAULT 0.00;
