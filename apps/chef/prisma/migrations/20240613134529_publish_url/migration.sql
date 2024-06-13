/*
  Warnings:

  - Made the column `bundle` on table `App` required. This step will fail if there are existing NULL values in that column.
  - Made the column `htmlTagName` on table `App` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "App" ALTER COLUMN "bundle" SET NOT NULL,
ALTER COLUMN "htmlTagName" SET NOT NULL;

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "publishUrl" TEXT;
