-- CreateEnum
CREATE TYPE "DateFormat" AS ENUM ('SYSTEM_DEFAULT', 'EUROPEAN', 'US_SLASH', 'ISO_8601');

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT,
    "logoUrl" TEXT,
    "taxId" TEXT,
    "defaultHourlyRate" DECIMAL(65,30),
    "defaultCurrency" TEXT NOT NULL DEFAULT 'USD',
    "defaultRefillLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateFormat" "DateFormat" NOT NULL DEFAULT 'SYSTEM_DEFAULT',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Preference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_userId_key" ON "Workspace"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Preference_userId_key" ON "Preference"("userId");

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preference" ADD CONSTRAINT "Preference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
