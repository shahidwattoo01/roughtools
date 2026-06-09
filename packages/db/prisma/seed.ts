// ============================================================
// Seed script â€” populates the database with initial data
// ============================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const tools = [
    {
      slug: 'bmi-calculator',
      name: 'BMI Calculator',
      description: 'Calculate your Body Mass Index based on height and weight.',
      category: 'calculators',
      icon: 'calculator',
      isPremium: false,
      isActive: true,
      sortOrder: 1,
    },
    {
      slug: 'calorie-calculator',
      name: 'Calorie Calculator',
      description: 'Calculate your daily caloric needs based on activity level and goals.',
      category: 'calculators',
      icon: 'fire',
      isPremium: false,
      isActive: true,
      sortOrder: 2,
    },
    {
      slug: 'loan-calculator',
      name: 'Loan Calculator',
      description: 'Calculate monthly payments, total interest, and amortization schedules.',
      category: 'calculators',
      icon: 'banknote',
      isPremium: false,
      isActive: true,
      sortOrder: 3,
    },
    {
      slug: 'mortgage-calculator',
      name: 'Mortgage Calculator',
      description: 'Calculate mortgage payments with taxes, insurance, and PMI.',
      category: 'calculators',
      icon: 'home',
      isPremium: false,
      isActive: true,
      sortOrder: 4,
    },
    {
      slug: 'currency-converter',
      name: 'Currency Converter',
      description: 'Convert between 150+ world currencies with real-time exchange rates.',
      category: 'calculators',
      icon: 'globe',
      isPremium: false,
      isActive: true,
      sortOrder: 5,
    },
    {
      slug: 'unit-converter',
      name: 'Unit Converter',
      description: 'Convert between units of length, weight, temperature, and more.',
      category: 'calculators',
      icon: 'ruler',
      isPremium: false,
      isActive: true,
      sortOrder: 6,
    },
    {
      slug: 'roi-calculator',
      name: 'ROI Calculator',
      description: 'Calculate return on investment with compound growth projections.',
      category: 'calculators',
      icon: 'trending-up',
      isPremium: false,
      isActive: true,
      sortOrder: 7,
    },
    {
      slug: 'tax-calculator',
      name: 'Tax Calculator',
      description: 'Estimate your federal and state income tax obligations.',
      category: 'calculators',
      icon: 'receipt',
      isPremium: false,
      isActive: true,
      sortOrder: 8,
    },
    {
      slug: 'days-between-dates',
      name: 'Days Between Dates',
      description: 'Calculate the number of days, weeks, and months between two dates.',
      category: 'calculators',
      icon: 'calendar',
      isPremium: false,
      isActive: true,
      sortOrder: 9,
    },
    {
      slug: 'password-generator',
      name: 'Password Generator',
      description: 'Generate strong, random passwords with customizable criteria.',
      category: 'security',
      icon: 'lock',
      isPremium: false,
      isActive: true,
      sortOrder: 10,
    },
    {
      slug: 'qr-code-generator',
      name: 'QR Code Generator',
      description: 'Create QR codes for URLs, text, WiFi, and contact information.',
      category: 'security',
      icon: 'qr-code',
      isPremium: false,
      isActive: true,
      sortOrder: 11,
    },
    {
      slug: 'ssl-checker',
      name: 'SSL Checker',
      description: 'Check the SSL certificate status, expiry, and configuration of any website.',
      category: 'security',
      icon: 'shield',
      isPremium: false,
      isActive: true,
      sortOrder: 12,
    },
  ];

  for (const tool of tools) {
    const existing = await prisma.tool.findUnique({ where: { slug: tool.slug } });
    if (!existing) {
      await prisma.tool.create({ data: tool });
      console.log(`  Created tool: ${tool.name}`);
    } else {
      console.log(`  Tool already exists: ${tool.name}`);
    }
  }

  const adminEmail = 'admin@roughtools.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        username: 'admin',
        passwordHash: 'REPLACE_WITH_BCRYPT_HASH_OF_Admin123!',
        name: 'Admin User',
        role: 'ADMIN',
        emailVerified: true,
        isActive: true,
      },
    });
    console.log('  Created admin user (admin@roughtools.com)');
  } else {
    console.log('  Admin user already exists');
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });