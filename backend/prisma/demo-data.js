import bcrypt from "bcryptjs";
import { PrismaClient, PostType, ResourceType } from "@prisma/client";

const prisma = new PrismaClient();
const passwordHash = await bcrypt.hash("Test1234", 10);
const securityMotherNameHash = await bcrypt.hash("demo mother", 10);
const securityBirthMonthHash = await bcrypt.hash("january", 10);

async function main() {
  const kitchen = await prisma.category.upsert({
    where: { name: "Kitchen Help" },
    update: {
      icon: "KH",
      description: "Recipes, meal planning, groceries, cooking basics, kitchen organization, and food storage."
    },
    create: {
      name: "Kitchen Help",
      icon: "KH",
      description: "Recipes, meal planning, groceries, cooking basics, kitchen organization, and food storage."
    }
  });

  const home = await prisma.category.upsert({
    where: { name: "Home Management" },
    update: {
      icon: "HM",
      description: "Cleaning, budgeting, organization, grocery planning, household routines, and family responsibilities."
    },
    create: {
      name: "Home Management",
      icon: "HM",
      description: "Cleaning, budgeting, organization, grocery planning, household routines, and family responsibilities."
    }
  });

  const testOne = await prisma.user.upsert({
    where: { email: "test.one@ghardaari.local" },
    update: {
      fullName: "Test One",
      username: "testone",
      passwordHash,
      role: "ADMIN",
      emailVerified: true,
      securityMotherNameHash,
      securityBirthMonthHash,
      bio: "Demo admin user for checking posts, groups, DMs, reports, and moderation."
    },
    create: {
      fullName: "Test One",
      username: "testone",
      email: "test.one@ghardaari.local",
      passwordHash,
      role: "ADMIN",
      emailVerified: true,
      securityMotherNameHash,
      securityBirthMonthHash,
      bio: "Demo admin user for checking posts, groups, DMs, reports, and moderation."
    }
  });

  const testTwo = await prisma.user.upsert({
    where: { email: "test.two@ghardaari.local" },
    update: {
      fullName: "Test Two",
      username: "testtwo",
      passwordHash,
      role: "MEMBER",
      emailVerified: true,
      securityMotherNameHash,
      securityBirthMonthHash,
      bio: "Demo member user for checking comments and direct messages."
    },
    create: {
      fullName: "Test Two",
      username: "testtwo",
      email: "test.two@ghardaari.local",
      passwordHash,
      role: "MEMBER",
      emailVerified: true,
      securityMotherNameHash,
      securityBirthMonthHash,
      bio: "Demo member user for checking comments and direct messages."
    }
  });

  await prisma.report.deleteMany({
    where: {
      OR: [
        { reporterId: { in: [testOne.id, testTwo.id] } },
        { targetId: { in: [] } }
      ]
    }
  });
  await prisma.post.deleteMany({
    where: { userId: { in: [testOne.id, testTwo.id] } }
  });
  await prisma.group.deleteMany({
    where: { name: "Test Home Helpers Group" }
  });
  await prisma.directConversation.deleteMany({
    where: {
      AND: [
        { members: { some: { userId: testOne.id } } },
        { members: { some: { userId: testTwo.id } } }
      ]
    }
  });
  await prisma.resource.deleteMany({
    where: { title: { startsWith: "Demo Test" } }
  });

  const testOnePost = await prisma.post.create({
    data: {
      userId: testOne.id,
      categoryId: kitchen.id,
      text: "Test One is checking the GharDaari home feed with a real database post.",
      type: PostType.THOUGHT,
      comments: {
        create: {
          userId: testTwo.id,
          commentText: "Test Two comment is working on this post."
        }
      },
      likes: {
        create: {
          userId: testTwo.id
        }
      },
      savedBy: {
        create: {
          userId: testTwo.id
        }
      }
    }
  });

  const testTwoPost = await prisma.post.create({
    data: {
      userId: testTwo.id,
      categoryId: home.id,
      text: "Test Two is checking that another user's post appears with report and block options.",
      type: PostType.THOUGHT,
      comments: {
        create: {
          userId: testOne.id,
          commentText: "Test One comment is also working."
        }
      },
      likes: {
        create: {
          userId: testOne.id
        }
      }
    }
  });

  await prisma.resource.create({
    data: {
      categoryId: kitchen.id,
      userId: testOne.id,
      title: "Demo Test Kitchen Resource",
      type: ResourceType.ARTICLE,
      sourceName: "Community Article",
      description: "Demo resource created for frontend checking.",
      url: "https://example.com/ghardaari-demo-resource"
    }
  });

  const group = await prisma.group.create({
    data: {
      createdById: testOne.id,
      name: "Test Home Helpers Group",
      description: "Demo group for checking group chat.",
      members: {
        create: [
          { userId: testOne.id, role: "ADMIN" },
          { userId: testTwo.id, role: "MEMBER" }
        ]
      },
      messages: {
        create: [
          { senderId: testOne.id, messageText: "Test One group message is working." },
          { senderId: testTwo.id, messageText: "Test Two group reply is working." }
        ]
      }
    }
  });

  const dm = await prisma.directConversation.create({
    data: {
      members: {
        create: [
          { userId: testOne.id },
          { userId: testTwo.id }
        ]
      },
      messages: {
        create: [
          { senderId: testOne.id, messageText: "Test One direct message is working." },
          { senderId: testTwo.id, messageText: "Test Two direct reply is working." }
        ]
      }
    }
  });

  await prisma.report.create({
    data: {
      reporterId: testTwo.id,
      targetType: "POST",
      targetId: testOnePost.id,
      reason: "Demo report so the admin dashboard has something to review."
    }
  });

  await prisma.$executeRaw`
    SELECT setval(pg_get_serial_sequence('"Resource"', 'id'), COALESCE((SELECT MAX(id) FROM "Resource"), 1), true)
  `;

  process.stdout.write([
    "Demo data ready.",
    "Test One login: test.one@ghardaari.local / Test1234",
    "Test Two login: test.two@ghardaari.local / Test1234",
    "Security answers for both: mother name = demo mother, birthday month = january",
    `Demo group id: ${group.id}`,
    `Demo direct conversation id: ${dm.id}`,
    `Demo posts: ${testOnePost.id}, ${testTwoPost.id}`
  ].join("\n") + "\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    await prisma.$disconnect();
    throw error;
  });
