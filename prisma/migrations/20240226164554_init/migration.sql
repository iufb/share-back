/*
  Warnings:

  - Made the column `isRepost` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "isReply" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "isRepost" SET NOT NULL,
ALTER COLUMN "isRepost" SET DEFAULT false;
