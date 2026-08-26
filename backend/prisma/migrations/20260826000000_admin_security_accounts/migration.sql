CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MEMBER');

CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'REVIEWED', 'DISMISSED', 'ACTION_TAKEN');

ALTER TABLE "User"
ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "emailVerificationTokenHash" TEXT,
ADD COLUMN "emailVerificationExpiresAt" TIMESTAMP(3),
ADD COLUMN "passwordResetTokenHash" TEXT,
ADD COLUMN "passwordResetExpiresAt" TIMESTAMP(3);

ALTER TABLE "Report"
ADD COLUMN "moderatorId" INTEGER,
ADD COLUMN "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "moderatorNote" TEXT,
ADD COLUMN "reviewedAt" TIMESTAMP(3);

CREATE TABLE "UserWarning" (
  "id" SERIAL NOT NULL,
  "userId" INTEGER NOT NULL,
  "moderatorId" INTEGER,
  "message" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "UserWarning_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Report_moderatorId_idx" ON "Report"("moderatorId");
CREATE INDEX "Report_status_idx" ON "Report"("status");
CREATE INDEX "UserWarning_userId_idx" ON "UserWarning"("userId");
CREATE INDEX "UserWarning_moderatorId_idx" ON "UserWarning"("moderatorId");

ALTER TABLE "Report" ADD CONSTRAINT "Report_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "UserWarning" ADD CONSTRAINT "UserWarning_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserWarning" ADD CONSTRAINT "UserWarning_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
