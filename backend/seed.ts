// seed.ts

import { PrismaClient} from '@prisma/client';
import { Role} from './types/index';

const prisma = new PrismaClient();

const users: Array<{
  id: string;
  username: string;
  password: string;
  email: string;
  role: Role;
  created_at: Date;
  updated_at: Date;
}> = [
  {
    id: 'e61ac00f-8740-42e0-9eb9-c14fcf965531',
    username: 'student1',
    password: 'password1',
    email: 'student1@example.com',
    role: "STUDENT",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '25724232-45ee-40c8-acc3-b48a0a8768cf',
    username: 'PROFESSOR',
    password: 'password2',
    email: 'PROFESSOR@example.com',
    role: "PROFESSOR",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'ba6e1c64-1212-4e7a-9666-e10ae400e576',
    username: 'admin1',
    password: 'password3',
    email: 'admin1@example.com',
    role: "ADMIN",
    created_at: new Date(),
    updated_at: new Date(),
  },
];

async function main() {
  await prisma.users.createMany({
    data: users,
    skipDuplicates: true,
  });
  console.log('Seed data inserted.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });