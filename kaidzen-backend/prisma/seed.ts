import { PrismaClient, Role, BlogStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { phone: '+998901234567' },
    update: {},
    create: {
      fullName: 'Admin User',
      phone: '+998901234567',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  console.log({ admin });

  // Create a sample test
  const test = await prisma.test.upsert({
    where: { slug: 'business-health-check' },
    update: {},
    create: {
      title: 'Business Health Check',
      slug: 'business-health-check',
      description: 'A comprehensive diagnostic for your business.',
      questions: {
        create: [
          {
            text: 'Do you have a clear business strategy?',
            order: 1,
            options: {
              create: [
                { text: 'Yes, fully documented', score: 10, order: 1 },
                { text: 'Yes, but not documented', score: 5, order: 2 },
                { text: 'No', score: 0, order: 3 },
              ],
            },
          },
        ],
      },
      resultLogic: {
        create: [
          {
            minScore: 0,
            maxScore: 5,
            resultText: 'Your business needs urgent attention.',
            recommendation: 'Schedule a consulting session immediately.',
          },
          {
            minScore: 6,
            maxScore: 10,
            resultText: 'Your business is doing okay, but could be better.',
            recommendation: 'Focus on documenting your processes.',
          },
        ],
      },
    },
  });

  console.log({ test });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
