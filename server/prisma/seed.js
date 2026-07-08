import prisma from '../src/config/db.js';

async function main() {
  console.log('Seeding database...');

  // Create a test user if it doesn't exist
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      firebaseId: 'test-firebase-id',
      email: 'test@example.com',
      displayName: 'Test User',
      role: 'ADMIN',
    },
  });

  console.log({ testUser });
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
