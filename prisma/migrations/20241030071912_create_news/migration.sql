-- CreateTable
CREATE TABLE "news" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "published_by" INTEGER NOT NULL,
    "published_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_published_by_fkey" FOREIGN KEY ("published_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
