/*
  Warnings:

  - The `dateFormat` column on the `Preference` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Preference" DROP COLUMN "dateFormat",
ADD COLUMN     "dateFormat" TEXT NOT NULL DEFAULT 'MMM d, yyyy';
