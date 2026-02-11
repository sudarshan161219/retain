/*
  Warnings:

  - You are about to drop the column `currentBalance` on the `Client` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,email]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Client_email_key";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "currentBalance",
ADD COLUMN     "hoursLogged" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "lastLogAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Client_userId_email_key" ON "Client"("userId", "email");
