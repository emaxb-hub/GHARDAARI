ALTER TABLE "Resource" ADD COLUMN "userId" INTEGER;

CREATE INDEX "Resource_userId_idx" ON "Resource"("userId");

ALTER TABLE "Resource" ADD CONSTRAINT "Resource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
