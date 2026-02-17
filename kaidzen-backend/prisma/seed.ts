import { PrismaClient } from '@prisma/client';
import { Role } from '../src/common/enums';
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
      questions: {
        create: [
          {
            text: 'Do you have a clear business strategy?',
            order: 1,
            options: {
              create: [
                { text: 'Yes, fully documented', order: 1, feedbackText: 'Great! You have a clear strategy.' },
                { text: 'Yes, but not documented', order: 2, feedbackText: 'Good, but consider documenting it.' },
                { text: 'No', order: 3, feedbackText: 'You need to develop a business strategy.' },
              ],
            },
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
