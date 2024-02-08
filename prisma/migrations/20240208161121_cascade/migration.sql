-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_sourceId_fkey";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
