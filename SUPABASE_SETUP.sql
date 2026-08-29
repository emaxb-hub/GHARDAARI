-- GharDaari Supabase setup
-- Paste this into Supabase SQL Editor and run it once.
-- It creates the app tables and starter category/resource data.

DO $$ BEGIN CREATE TYPE "PostType" AS ENUM ('THOUGHT', 'QUESTION', 'EXPERIENCE', 'ADVICE'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "ResourceType" AS ENUM ('YOUTUBE_VIDEO', 'ARTICLE', 'GUIDE', 'WEBSITE', 'PDF'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "GroupRole" AS ENUM ('ADMIN', 'MEMBER'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MEMBER'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "ReportTargetType" AS ENUM ('POST', 'COMMENT', 'USER', 'GROUP_MESSAGE', 'DIRECT_MESSAGE'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'REVIEWED', 'DISMISSED', 'ACTION_TAKEN'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "User" (
  "id" SERIAL PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  "username" TEXT NOT NULL UNIQUE,
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
  "bio" TEXT,
  "profileImage" TEXT,
  "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  "emailVerificationTokenHash" TEXT,
  "emailVerificationExpiresAt" TIMESTAMP(3),
  "passwordResetTokenHash" TEXT,
  "passwordResetExpiresAt" TIMESTAMP(3),
  "securityMotherNameHash" TEXT,
  "securityBirthMonthHash" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Category" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "description" TEXT NOT NULL,
  "icon" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Post" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "categoryId" INTEGER NOT NULL REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "text" TEXT NOT NULL,
  "imageUrl" TEXT,
  "type" "PostType" NOT NULL DEFAULT 'THOUGHT',
  "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Comment" (
  "id" SERIAL PRIMARY KEY,
  "postId" INTEGER NOT NULL REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "userId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "commentText" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "PostLike" (
  "id" SERIAL PRIMARY KEY,
  "postId" INTEGER NOT NULL REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "userId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("postId", "userId")
);

CREATE TABLE IF NOT EXISTS "SavedPost" (
  "id" SERIAL PRIMARY KEY,
  "postId" INTEGER NOT NULL REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "userId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("postId", "userId")
);

CREATE TABLE IF NOT EXISTS "Resource" (
  "id" SERIAL PRIMARY KEY,
  "categoryId" INTEGER NOT NULL REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "userId" INTEGER REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  "title" TEXT NOT NULL,
  "type" "ResourceType" NOT NULL,
  "sourceName" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "thumbnailUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Group" (
  "id" SERIAL PRIMARY KEY,
  "createdById" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "GroupMember" (
  "id" SERIAL PRIMARY KEY,
  "groupId" INTEGER NOT NULL REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "userId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "role" "GroupRole" NOT NULL DEFAULT 'MEMBER',
  "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("groupId", "userId")
);

CREATE TABLE IF NOT EXISTS "GroupMessage" (
  "id" SERIAL PRIMARY KEY,
  "groupId" INTEGER NOT NULL REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "senderId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "messageText" TEXT NOT NULL,
  "imageUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "DirectConversation" (
  "id" SERIAL PRIMARY KEY,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "DirectConversationMember" (
  "id" SERIAL PRIMARY KEY,
  "conversationId" INTEGER NOT NULL REFERENCES "DirectConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "userId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE ("conversationId", "userId")
);

CREATE TABLE IF NOT EXISTS "DirectMessage" (
  "id" SERIAL PRIMARY KEY,
  "conversationId" INTEGER NOT NULL REFERENCES "DirectConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "senderId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "messageText" TEXT NOT NULL,
  "imageUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Report" (
  "id" SERIAL PRIMARY KEY,
  "reporterId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "moderatorId" INTEGER REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  "targetType" "ReportTargetType" NOT NULL,
  "targetId" INTEGER NOT NULL,
  "reason" TEXT NOT NULL,
  "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
  "moderatorNote" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "BlockedUser" (
  "id" SERIAL PRIMARY KEY,
  "blockerId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "blockedId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("blockerId", "blockedId")
);

CREATE TABLE IF NOT EXISTS "UserWarning" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "moderatorId" INTEGER REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  "message" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "RateLimitBucket" (
  "key" TEXT PRIMARY KEY,
  "count" INTEGER NOT NULL,
  "resetAt" TIMESTAMP(3) NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" "UserRole" NOT NULL DEFAULT 'MEMBER';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerificationTokenHash" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerificationExpiresAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordResetTokenHash" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordResetExpiresAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "securityMotherNameHash" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "securityBirthMonthHash" TEXT;
ALTER TABLE "Resource" ADD COLUMN IF NOT EXISTS "userId" INTEGER;
ALTER TABLE "Report" ADD COLUMN IF NOT EXISTS "moderatorId" INTEGER;
ALTER TABLE "Report" ADD COLUMN IF NOT EXISTS "status" "ReportStatus" NOT NULL DEFAULT 'PENDING';
ALTER TABLE "Report" ADD COLUMN IF NOT EXISTS "moderatorNote" TEXT;
ALTER TABLE "Report" ADD COLUMN IF NOT EXISTS "reviewedAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "Post_userId_idx" ON "Post"("userId");
CREATE INDEX IF NOT EXISTS "Post_categoryId_idx" ON "Post"("categoryId");
CREATE INDEX IF NOT EXISTS "Comment_postId_idx" ON "Comment"("postId");
CREATE INDEX IF NOT EXISTS "Comment_userId_idx" ON "Comment"("userId");
CREATE INDEX IF NOT EXISTS "PostLike_userId_idx" ON "PostLike"("userId");
CREATE INDEX IF NOT EXISTS "SavedPost_userId_idx" ON "SavedPost"("userId");
CREATE INDEX IF NOT EXISTS "Resource_categoryId_idx" ON "Resource"("categoryId");
CREATE INDEX IF NOT EXISTS "Resource_userId_idx" ON "Resource"("userId");
CREATE INDEX IF NOT EXISTS "Group_createdById_idx" ON "Group"("createdById");
CREATE INDEX IF NOT EXISTS "GroupMember_userId_idx" ON "GroupMember"("userId");
CREATE INDEX IF NOT EXISTS "GroupMessage_groupId_idx" ON "GroupMessage"("groupId");
CREATE INDEX IF NOT EXISTS "GroupMessage_senderId_idx" ON "GroupMessage"("senderId");
CREATE INDEX IF NOT EXISTS "DirectConversationMember_userId_idx" ON "DirectConversationMember"("userId");
CREATE INDEX IF NOT EXISTS "DirectMessage_conversationId_idx" ON "DirectMessage"("conversationId");
CREATE INDEX IF NOT EXISTS "DirectMessage_senderId_idx" ON "DirectMessage"("senderId");
CREATE INDEX IF NOT EXISTS "Report_reporterId_idx" ON "Report"("reporterId");
CREATE INDEX IF NOT EXISTS "Report_moderatorId_idx" ON "Report"("moderatorId");
CREATE INDEX IF NOT EXISTS "Report_status_idx" ON "Report"("status");
CREATE INDEX IF NOT EXISTS "Report_targetType_targetId_idx" ON "Report"("targetType", "targetId");
CREATE INDEX IF NOT EXISTS "BlockedUser_blockedId_idx" ON "BlockedUser"("blockedId");
CREATE INDEX IF NOT EXISTS "UserWarning_userId_idx" ON "UserWarning"("userId");
CREATE INDEX IF NOT EXISTS "UserWarning_moderatorId_idx" ON "UserWarning"("moderatorId");
CREATE INDEX IF NOT EXISTS "RateLimitBucket_resetAt_idx" ON "RateLimitBucket"("resetAt");

INSERT INTO "Category" ("name", "icon", "description") VALUES
('Kitchen Help', 'KH', 'Recipes, meal planning, groceries, cooking basics, kitchen organization, and food storage.'),
('Sewing & Clothing', 'SC', 'Stitching, darzi tips, fabrics, lace, clothing care, measurements, and sewing tutorials.'),
('Baby & Mother Care', 'BM', 'Baby food, feeding, sleep routines, pregnancy awareness, common care, and postpartum guidance.'),
('Women''s Rights', 'WR', 'Nikah rights, inheritance, workplace rights, domestic safety, legal awareness, and support resources.'),
('Home Management', 'HM', 'Cleaning, budgeting, organization, grocery planning, household routines, and family responsibilities.'),
('Health & Wellness', 'HW', 'Periods, hygiene, PCOS awareness, nutrition, self-care, mental health, and wellness.')
ON CONFLICT ("name") DO UPDATE SET
"icon" = EXCLUDED."icon",
"description" = EXCLUDED."description";

INSERT INTO "Resource" ("id", "categoryId", "title", "type", "sourceName", "description", "url")
SELECT 1, "id", 'Pakistani Meal Planning Ideas', 'YOUTUBE_VIDEO'::"ResourceType", 'YouTube Search', 'Meal planning and recipe references for daily Pakistani cooking.', 'https://www.youtube.com/results?search_query=pakistani+meal+planning+urdu' FROM "Category" WHERE "name" = 'Kitchen Help'
ON CONFLICT ("id") DO UPDATE SET "categoryId" = EXCLUDED."categoryId", "title" = EXCLUDED."title", "type" = EXCLUDED."type", "sourceName" = EXCLUDED."sourceName", "description" = EXCLUDED."description", "url" = EXCLUDED."url";

INSERT INTO "Resource" ("id", "categoryId", "title", "type", "sourceName", "description", "url")
SELECT 2, "id", 'Food Storage Basics', 'GUIDE'::"ResourceType", 'GharDaari Guide', 'Simple storage habits for groceries, cooked food, and dry items.', 'https://www.google.com/search?q=food+storage+tips+pakistan' FROM "Category" WHERE "name" = 'Kitchen Help'
ON CONFLICT ("id") DO UPDATE SET "categoryId" = EXCLUDED."categoryId", "title" = EXCLUDED."title", "type" = EXCLUDED."type", "sourceName" = EXCLUDED."sourceName", "description" = EXCLUDED."description", "url" = EXCLUDED."url";

INSERT INTO "Resource" ("id", "categoryId", "title", "type", "sourceName", "description", "url")
SELECT 3, "id", 'Basic Kurti Cutting Tutorial', 'YOUTUBE_VIDEO'::"ResourceType", 'YouTube Search', 'Beginner stitching and cutting lessons.', 'https://www.youtube.com/results?search_query=basic+kurti+cutting+tutorial+urdu' FROM "Category" WHERE "name" = 'Sewing & Clothing'
ON CONFLICT ("id") DO UPDATE SET "categoryId" = EXCLUDED."categoryId", "title" = EXCLUDED."title", "type" = EXCLUDED."type", "sourceName" = EXCLUDED."sourceName", "description" = EXCLUDED."description", "url" = EXCLUDED."url";

INSERT INTO "Resource" ("id", "categoryId", "title", "type", "sourceName", "description", "url")
SELECT 4, "id", 'Fabric Types Explained', 'ARTICLE'::"ResourceType", 'Helpful Website', 'Learn which fabrics suit daily wear, summer, and formal outfits.', 'https://www.google.com/search?q=pakistani+fabric+types+for+women' FROM "Category" WHERE "name" = 'Sewing & Clothing'
ON CONFLICT ("id") DO UPDATE SET "categoryId" = EXCLUDED."categoryId", "title" = EXCLUDED."title", "type" = EXCLUDED."type", "sourceName" = EXCLUDED."sourceName", "description" = EXCLUDED."description", "url" = EXCLUDED."url";

INSERT INTO "Resource" ("id", "categoryId", "title", "type", "sourceName", "description", "url")
SELECT 5, "id", 'Newborn Care Tips', 'YOUTUBE_VIDEO'::"ResourceType", 'YouTube Search', 'General newborn care and mother care learning references.', 'https://www.youtube.com/results?search_query=newborn+care+tips+urdu' FROM "Category" WHERE "name" = 'Baby & Mother Care'
ON CONFLICT ("id") DO UPDATE SET "categoryId" = EXCLUDED."categoryId", "title" = EXCLUDED."title", "type" = EXCLUDED."type", "sourceName" = EXCLUDED."sourceName", "description" = EXCLUDED."description", "url" = EXCLUDED."url";

INSERT INTO "Resource" ("id", "categoryId", "title", "type", "sourceName", "description", "url")
SELECT 6, "id", 'Postpartum Care Checklist', 'GUIDE'::"ResourceType", 'Health Guide', 'Rest, hydration, meals, support, and doctor follow-up reminders.', 'https://www.google.com/search?q=postpartum+care+tips+urdu' FROM "Category" WHERE "name" = 'Baby & Mother Care'
ON CONFLICT ("id") DO UPDATE SET "categoryId" = EXCLUDED."categoryId", "title" = EXCLUDED."title", "type" = EXCLUDED."type", "sourceName" = EXCLUDED."sourceName", "description" = EXCLUDED."description", "url" = EXCLUDED."url";

INSERT INTO "Resource" ("id", "categoryId", "title", "type", "sourceName", "description", "url")
SELECT 7, "id", 'Nikah Nama Rights Awareness', 'ARTICLE'::"ResourceType", 'Legal Awareness', 'Learn what to read and ask before signing marriage documents.', 'https://www.google.com/search?q=nikah+nama+rights+pakistan' FROM "Category" WHERE "name" = 'Women''s Rights'
ON CONFLICT ("id") DO UPDATE SET "categoryId" = EXCLUDED."categoryId", "title" = EXCLUDED."title", "type" = EXCLUDED."type", "sourceName" = EXCLUDED."sourceName", "description" = EXCLUDED."description", "url" = EXCLUDED."url";

INSERT INTO "Resource" ("id", "categoryId", "title", "type", "sourceName", "description", "url")
SELECT 8, "id", 'Women Legal Rights Pakistan', 'YOUTUBE_VIDEO'::"ResourceType", 'YouTube Search', 'Video references for basic rights and support awareness.', 'https://www.youtube.com/results?search_query=women+legal+rights+pakistan+urdu' FROM "Category" WHERE "name" = 'Women''s Rights'
ON CONFLICT ("id") DO UPDATE SET "categoryId" = EXCLUDED."categoryId", "title" = EXCLUDED."title", "type" = EXCLUDED."type", "sourceName" = EXCLUDED."sourceName", "description" = EXCLUDED."description", "url" = EXCLUDED."url";

INSERT INTO "Resource" ("id", "categoryId", "title", "type", "sourceName", "description", "url")
SELECT 9, "id", 'Monthly Budget Checklist', 'GUIDE'::"ResourceType", 'GharDaari Guide', 'Plan groceries, bills, savings, and emergency money.', 'https://www.google.com/search?q=monthly+home+budget+planning+urdu' FROM "Category" WHERE "name" = 'Home Management'
ON CONFLICT ("id") DO UPDATE SET "categoryId" = EXCLUDED."categoryId", "title" = EXCLUDED."title", "type" = EXCLUDED."type", "sourceName" = EXCLUDED."sourceName", "description" = EXCLUDED."description", "url" = EXCLUDED."url";

INSERT INTO "Resource" ("id", "categoryId", "title", "type", "sourceName", "description", "url")
SELECT 10, "id", 'Home Cleaning Routine', 'ARTICLE'::"ResourceType", 'Helpful Website', 'Daily, weekly, and monthly cleaning structure.', 'https://www.google.com/search?q=home+cleaning+routine+checklist' FROM "Category" WHERE "name" = 'Home Management'
ON CONFLICT ("id") DO UPDATE SET "categoryId" = EXCLUDED."categoryId", "title" = EXCLUDED."title", "type" = EXCLUDED."type", "sourceName" = EXCLUDED."sourceName", "description" = EXCLUDED."description", "url" = EXCLUDED."url";

INSERT INTO "Resource" ("id", "categoryId", "title", "type", "sourceName", "description", "url")
SELECT 11, "id", 'PCOS Awareness in Urdu', 'YOUTUBE_VIDEO'::"ResourceType", 'YouTube Search', 'Introductory health awareness references.', 'https://www.youtube.com/results?search_query=pcos+awareness+urdu' FROM "Category" WHERE "name" = 'Health & Wellness'
ON CONFLICT ("id") DO UPDATE SET "categoryId" = EXCLUDED."categoryId", "title" = EXCLUDED."title", "type" = EXCLUDED."type", "sourceName" = EXCLUDED."sourceName", "description" = EXCLUDED."description", "url" = EXCLUDED."url";

INSERT INTO "Resource" ("id", "categoryId", "title", "type", "sourceName", "description", "url")
SELECT 12, "id", 'Menstrual Hygiene Basics', 'ARTICLE'::"ResourceType", 'Health Guide', 'Period hygiene, tracking, and self-care learning.', 'https://www.google.com/search?q=menstrual+hygiene+urdu' FROM "Category" WHERE "name" = 'Health & Wellness'
ON CONFLICT ("id") DO UPDATE SET "categoryId" = EXCLUDED."categoryId", "title" = EXCLUDED."title", "type" = EXCLUDED."type", "sourceName" = EXCLUDED."sourceName", "description" = EXCLUDED."description", "url" = EXCLUDED."url";

SELECT setval(pg_get_serial_sequence('"Resource"', 'id'), COALESCE((SELECT MAX("id") FROM "Resource"), 1), true);
