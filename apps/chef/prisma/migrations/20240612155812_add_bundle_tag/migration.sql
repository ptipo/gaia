/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `App` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "App" ADD COLUMN     "bundle" TEXT,
ADD COLUMN     "htmlTagName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "App_name_key" ON "App"("name");
