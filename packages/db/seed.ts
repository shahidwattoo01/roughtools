import "dotenv/config";
import { db } from "./src/client.js";
import { hash } from "bcryptjs";
import { faker } from "@faker-js/faker";

const ROLES = ["ADMIN", "EDITOR", "MEMBER"] as const;
const STATUSES_TOOL = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
const STATUSES_POST = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
const CATEGORIES = [
  "Development",
  "Design",
  "AI & Machine Learning",
  "DevOps",
  "Security",
  "Analytics",
  "Productivity",
  "Communication",
  "Marketing",
  "Finance",
  "Education",
  "Health",
];
const TAGS = [
  "open-source",
  "free",
  "paid",
  "saas",
  "self-hosted",
  "ai-powered",
  "api",
  "cli",
  "no-code",
  "mobile",
  "collaboration",
  "automation",
  "privacy",
  "enterprise",
  "startup",
  "react",
  "nodejs",
  "python",
  "rust",
  "typescript",
  "docker",
  "kubernetes",
  "serverless",
  "real-time",
  "offline-first",
];

async function seed() {
  console.log("â³ Seeding database...");

  // â”€â”€â”€ 1. Users â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  console.log("  Creating users...");
  const rounds = parseInt(process.env.BCRYPT_ROUNDS ?? "12");
  const users: { id: string }[] = [];

  // Ensure one known admin for dev login
  users.push(
    await db.user.create({
      data: {
        email: "admin@roughtools.com",
        name: "Admin User",
        password: await hash("password123", rounds),
        role: "ADMIN",
        avatar: faker.image.avatar(),
        emailVerified: new Date(),
      },
    }),
  );

  for (let i = 0; i < 49; i++) {
    users.push(
      await db.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: await hash("password123", rounds),
          role: faker.helpers.arrayElement(ROLES),
          avatar: faker.image.avatar(),
          emailVerified: faker.date.past(),
          bio: faker.lorem.sentence(),
        },
      }),
    );
  }
  console.log(`  âœ… ${users.length} users`);

  // â”€â”€â”€ 2. Categories â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  console.log("  Creating categories...");
  const categories: { id: string; slug: string }[] = [];

  for (const [i, name] of CATEGORIES.entries()) {
    categories.push(
      await db.category.create({
        data: {
          name,
          slug: faker.helpers.slugify(name).toLowerCase(),
          description: faker.lorem.sentence(),
          sortOrder: i,
        },
      }),
    );
  }
  console.log(`  âœ… ${categories.length} categories`);

  // â”€â”€â”€ 3. Tags â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  console.log("  Creating tags...");
  const tags: { id: string }[] = [];

  for (const name of TAGS) {
    tags.push(
      await db.tag.create({
        data: {
          name,
          slug: name.replace(/[^a-z0-9]+/g, "-").toLowerCase(),
        },
      }),
    );
  }
  console.log(`  âœ… ${tags.length} tags`);

  // â”€â”€â”€ 4. Tools â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  console.log("  Creating tools...");
  const tools: { id: string }[] = [];

  for (let i = 0; i < 200; i++) {
    const status = faker.helpers.arrayElement(STATUSES_TOOL);
    tools.push(
      await db.tool.create({
        data: {
          name: faker.commerce.productName(),
          slug: faker.helpers
            .slugify(faker.commerce.productName() + "-" + i)
            .toLowerCase(),
          description: faker.lorem.paragraphs(2),
          categoryId: faker.helpers.arrayElement(categories).id,
          authorId: faker.helpers.arrayElement(users).id,
          status,
          features: {
            pricing: faker.helpers.arrayElement([
              "free",
              "freemium",
              "paid",
              "enterprise",
            ]),
            hasApi: faker.datatype.boolean(),
            hasCli: faker.datatype.boolean(),
          },
          githubUrl: faker.datatype.boolean() ? faker.internet.url() : null,
          demoUrl: faker.datatype.boolean() ? faker.internet.url() : null,
          viewCount: faker.number.int({ min: 0, max: 50000 }),
          likeCount: faker.number.int({ min: 0, max: 2000 }),
          createdAt: faker.date.past({ years: 2 }),
        },
      }),
    );

    // Attach 1-5 random tags per tool
    const toolTags = faker.helpers.arrayElements(tags, {
      min: 1,
      max: 5,
    });
    for (const tag of toolTags) {
      await db.toolTag.create({
        data: { toolId: tools[tools.length - 1].id, tagId: tag.id },
      });
    }
  }
  console.log(`  âœ… ${tools.length} tools + tag relations`);

  // â”€â”€â”€ 5. Blog Posts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  console.log("  Creating blog posts...");
  let postCount = 0;

  for (let i = 0; i < 25; i++) {
    const status = faker.helpers.arrayElement(STATUSES_POST);
    const publishedAt =
      status === "PUBLISHED" ? faker.date.past({ years: 1 }) : null;

    await db.blogPost.create({
      data: {
        title: faker.lorem.sentence().replace(/\.$/, ""),
        slug: faker.helpers
          .slugify(faker.lorem.words(5) + "-" + i)
          .toLowerCase(),
        content: faker.lorem.paragraphs(8),
        excerpt: faker.lorem.sentence(),
        coverImage: faker.datatype.boolean()
          ? `https://picsum.photos/seed/${i}/1200/600`
          : null,
        authorId: faker.helpers.arrayElement(users).id,
        status,
        publishedAt,
        createdAt: publishedAt ?? faker.date.recent({ days: 30 }),
      },
    });
    postCount++;
  }
  console.log(`  âœ… ${postCount} blog posts`);

  // â”€â”€â”€ 6. API Keys â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  console.log("  Creating API keys...");
  const keyUsers = faker.helpers.arrayElements(users, { min: 5, max: 10 });

  for (const user of keyUsers) {
    await db.apiKey.create({
      data: {
        userId: user.id,
        key: `tvk_${faker.string.alphanumeric(32)}`,
        name: faker.helpers.arrayElement([
          "CLI Key",
          "Web Client",
          "Mobile App",
          "CI/CD",
        ]),
        permissions: {
          read: true,
          write: faker.datatype.boolean(),
          admin: faker.datatype.boolean({ probability: 0.1 }),
        },
        expiresAt: faker.date.future({ years: 1 }),
      },
    });
  }
  console.log(`  âœ… ${keyUsers.length} API keys`);

  // â”€â”€â”€ 7. Comments â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  console.log("  Creating comments...");
  let commentCount = 0;
  const publishedTools = tools; // comment on all tools for variety

  for (let i = 0; i < 100; i++) {
    await db.comment.create({
      data: {
        content: faker.lorem.sentences(2),
        toolId: faker.helpers.arrayElement(publishedTools).id,
        authorId: faker.helpers.arrayElement(users).id,
        parentId: faker.datatype.boolean({ probability: 0.2 })
          ? undefined
          : undefined, // top-level only for simplicity
        createdAt: faker.date.recent({ days: 60 }),
      },
    });
    commentCount++;
  }
  console.log(`  âœ… ${commentCount} comments`);

  // â”€â”€â”€ 8. Audit Logs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  console.log("  Creating audit logs...");
  const actions = [
    "user.login",
    "user.register",
    "tool.create",
    "tool.update",
    "tool.delete",
    "tool.publish",
    "blog.create",
    "blog.update",
    "blog.publish",
    "category.create",
    "tag.create",
    "apikey.create",
  ];
  const entities = ["User", "Tool", "BlogPost", "Category", "Tag", "ApiKey"];

  for (let i = 0; i < 150; i++) {
    const entity = faker.helpers.arrayElement(entities);
    await db.auditLog.create({
      data: {
        userId: faker.datatype.boolean()
          ? faker.helpers.arrayElement(users).id
          : null,
        action: faker.helpers.arrayElement(actions),
        entity,
        entityId: faker.string.alphanumeric(20),
        ip: faker.internet.ipv4(),
        metadata: faker.datatype.boolean()
          ? { userAgent: faker.internet.userAgent() }
          : null,
        createdAt: faker.date.past({ years: 1 }),
      },
    });
  }
  console.log("  âœ… 150 audit logs");

  console.log("\nâœ… Seed complete â€” 427+ records created");
}

seed()
  .catch((e) => {
    console.error("âŒ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
