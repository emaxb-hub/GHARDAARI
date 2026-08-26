import { PrismaClient, ResourceType } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Kitchen Help",
    icon: "KH",
    description: "Recipes, meal planning, groceries, cooking basics, kitchen organization, and food storage."
  },
  {
    name: "Sewing & Clothing",
    icon: "SC",
    description: "Stitching, darzi tips, fabrics, lace, clothing care, measurements, and sewing tutorials."
  },
  {
    name: "Baby & Mother Care",
    icon: "BM",
    description: "Baby food, feeding, sleep routines, pregnancy awareness, common care, and postpartum guidance."
  },
  {
    name: "Women's Rights",
    icon: "WR",
    description: "Nikah rights, inheritance, workplace rights, domestic safety, legal awareness, and support resources."
  },
  {
    name: "Home Management",
    icon: "HM",
    description: "Cleaning, budgeting, organization, grocery planning, household routines, and family responsibilities."
  },
  {
    name: "Health & Wellness",
    icon: "HW",
    description: "Periods, hygiene, PCOS awareness, nutrition, self-care, mental health, and wellness."
  }
];

const resources = [
  {
    id: 1,
    title: "Pakistani Meal Planning Ideas",
    type: ResourceType.YOUTUBE_VIDEO,
    sourceName: "YouTube Search",
    categoryName: "Kitchen Help",
    description: "Meal planning and recipe references for daily Pakistani cooking.",
    url: "https://www.youtube.com/results?search_query=pakistani+meal+planning+urdu"
  },
  {
    id: 2,
    title: "Food Storage Basics",
    type: ResourceType.GUIDE,
    sourceName: "GharDaari Guide",
    categoryName: "Kitchen Help",
    description: "Simple storage habits for groceries, cooked food, and dry items.",
    url: "https://www.google.com/search?q=food+storage+tips+pakistan"
  },
  {
    id: 3,
    title: "Basic Kurti Cutting Tutorial",
    type: ResourceType.YOUTUBE_VIDEO,
    sourceName: "YouTube Search",
    categoryName: "Sewing & Clothing",
    description: "Beginner stitching and cutting lessons.",
    url: "https://www.youtube.com/results?search_query=basic+kurti+cutting+tutorial+urdu"
  },
  {
    id: 4,
    title: "Fabric Types Explained",
    type: ResourceType.ARTICLE,
    sourceName: "Helpful Website",
    categoryName: "Sewing & Clothing",
    description: "Learn which fabrics suit daily wear, summer, and formal outfits.",
    url: "https://www.google.com/search?q=pakistani+fabric+types+for+women"
  },
  {
    id: 5,
    title: "Newborn Care Tips",
    type: ResourceType.YOUTUBE_VIDEO,
    sourceName: "YouTube Search",
    categoryName: "Baby & Mother Care",
    description: "General newborn care and mother care learning references.",
    url: "https://www.youtube.com/results?search_query=newborn+care+tips+urdu"
  },
  {
    id: 6,
    title: "Postpartum Care Checklist",
    type: ResourceType.GUIDE,
    sourceName: "Health Guide",
    categoryName: "Baby & Mother Care",
    description: "Rest, hydration, meals, support, and doctor follow-up reminders.",
    url: "https://www.google.com/search?q=postpartum+care+tips+urdu"
  },
  {
    id: 7,
    title: "Nikah Nama Rights Awareness",
    type: ResourceType.ARTICLE,
    sourceName: "Legal Awareness",
    categoryName: "Women's Rights",
    description: "Learn what to read and ask before signing marriage documents.",
    url: "https://www.google.com/search?q=nikah+nama+rights+pakistan"
  },
  {
    id: 8,
    title: "Women Legal Rights Pakistan",
    type: ResourceType.YOUTUBE_VIDEO,
    sourceName: "YouTube Search",
    categoryName: "Women's Rights",
    description: "Video references for basic rights and support awareness.",
    url: "https://www.youtube.com/results?search_query=women+legal+rights+pakistan+urdu"
  },
  {
    id: 9,
    title: "Monthly Budget Checklist",
    type: ResourceType.GUIDE,
    sourceName: "GharDaari Guide",
    categoryName: "Home Management",
    description: "Plan groceries, bills, savings, and emergency money.",
    url: "https://www.google.com/search?q=monthly+home+budget+planning+urdu"
  },
  {
    id: 10,
    title: "Home Cleaning Routine",
    type: ResourceType.ARTICLE,
    sourceName: "Helpful Website",
    categoryName: "Home Management",
    description: "Daily, weekly, and monthly cleaning structure.",
    url: "https://www.google.com/search?q=home+cleaning+routine+checklist"
  },
  {
    id: 11,
    title: "PCOS Awareness in Urdu",
    type: ResourceType.YOUTUBE_VIDEO,
    sourceName: "YouTube Search",
    categoryName: "Health & Wellness",
    description: "Introductory health awareness references.",
    url: "https://www.youtube.com/results?search_query=pcos+awareness+urdu"
  },
  {
    id: 12,
    title: "Menstrual Hygiene Basics",
    type: ResourceType.ARTICLE,
    sourceName: "Health Guide",
    categoryName: "Health & Wellness",
    description: "Period hygiene, tracking, and self-care learning.",
    url: "https://www.google.com/search?q=menstrual+hygiene+urdu"
  }
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: category,
      create: category
    });
  }

  for (const resource of resources) {
    const category = await prisma.category.findUnique({ where: { name: resource.categoryName } });
    if (!category) continue;

    await prisma.resource.upsert({
      where: { id: resource.id },
      update: {
        categoryId: category.id,
        title: resource.title,
        type: resource.type,
        sourceName: resource.sourceName,
        description: resource.description,
        url: resource.url
      },
      create: {
        id: resource.id,
        categoryId: category.id,
        title: resource.title,
        type: resource.type,
        sourceName: resource.sourceName,
        description: resource.description,
        url: resource.url
      }
    });
  }

  await prisma.$executeRaw`
    SELECT setval(pg_get_serial_sequence('"Resource"', 'id'), COALESCE((SELECT MAX(id) FROM "Resource"), 1), true)
  `;
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    await prisma.$disconnect();
    throw error;
  });
