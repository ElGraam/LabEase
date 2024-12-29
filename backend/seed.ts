import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import { performance } from "node:perf_hooks";
import { Users, Lab } from "./types/index";
import crypto from "crypto";

const prisma = new PrismaClient();

const readJsonFile = (path: string) => {
  return JSON.parse(fs.readFileSync(path, { encoding: "utf8" }));
};

const main = async () => {
  const labStart = performance.now();
  const labs: Lab[] = readJsonFile("./seeding_files/dummyLab.json");
  const registeredLabs = await prisma.lab.findMany();
  console.log(`registered labs length: ${labs.length}`);

  const filteredLabs = labs.filter(
    ({ id }) =>
      !registeredLabs.some((registeredLab) => id === registeredLab.id),
  );

  console.log(`create labs length: ${filteredLabs.length}`);

  try {
    await prisma.lab.createMany({
      data: filteredLabs.map((lab: Lab) => {
        return {
          id: lab.id,
          name: lab.name,
          professorId: lab.professorId,
          description: lab.description,
          created_at: new Date(lab.created_at),
          updated_at: new Date(lab.updated_at),
        };
      }),
      skipDuplicates: true,
    });
  } catch (error) {
    console.error(error);
    throw Error();
  }

  const labEnd = performance.now();
  console.log(`lab create time: ${labEnd - labStart}ms`);
  console.log("fin lab");

  const userStart = performance.now();
  const users: Users[] = readJsonFile("./seeding_files/dummyUsers.json");
  const registeredUsers = await prisma.users.findMany();
  console.log(`registered users length: ${registeredUsers.length}`);

  const filteredUsers = users.filter(
    ({ id }) =>
      !registeredUsers.some((registeredUser) => id === registeredUser.id),
  );

  console.log(`create users length: ${filteredUsers.length}`);

  try {
    // Create users first
    await prisma.users.createMany({
      data: filteredUsers.map((member) => ({
        id: member.id,
        username: member.username,
        email: member.email,
        role: member.role,
        labId: member.labId,
        program: member.program,
        studentId: member.studentId,
        password: crypto
          .createHash("sha256")
          .update(member.password || "")
          .digest("base64"),
        created_at: new Date(member.created_at),
        updated_at: new Date(member.updated_at),
      })),
      skipDuplicates: true,
    });

    // Create student profiles after users
    for (const member of filteredUsers) {
      if (member.studentProfile) {
        await prisma.studentProfile.create({
          data: {
            id: member.studentProfile.id,
            userId: member.id,
            entryYear: member.studentProfile.entryYear,
            entryMonth: member.studentProfile.entryMonth,
            plannedGradYear: member.studentProfile.plannedGradYear,
            plannedGradMonth: member.studentProfile.plannedGradMonth,
            status: member.studentProfile.status,
            created_at: new Date(member.studentProfile.created_at),
            updated_at: new Date(member.studentProfile.updated_at),
          },
        });
      }
    }
  } catch (error) {
    console.error(error);
    throw Error();
  }

  const userEnd = performance.now();
  console.log(`users create time: ${userEnd - userStart}ms`);
  console.log("fin users");
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
