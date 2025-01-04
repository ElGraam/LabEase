import { prisma } from '../../lib/prisma';
import dummyUsers from '../../seeding_files/dummyUsers.json';
import dummyLabs from '../../seeding_files/dummyLab.json';
import { 
  EntryMonth, 
  GraduationMonth, 
  StudentStatus, 
  Role, 
  ProgramType 
} from '../../types';

export async function getTestData() {
  // データベースのクリーンアップ
  await prisma.meetingParticipant.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.availableSlot.deleteMany();
  await prisma.projectMilestone.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.users.deleteMany();
  await prisma.lab.deleteMany();

  // 研究室データの作成
  const labs = await Promise.all(
    dummyLabs.map(async (lab) => {
      return await prisma.lab.create({
        data: {
          id: lab.id,
          name: lab.name,
          description: lab.description,
          professorId: lab.professorId,
          created_at: new Date(lab.created_at),
          updated_at: new Date(lab.updated_at),
        },
      });
    })
  );

  // ユーザーデータの作成
  const users = await Promise.all(
    dummyUsers.map(async (user) => {
      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role as Role,
        studentId: user.studentId,
        program: user.program as ProgramType | undefined,
        labId: user.labId ?? undefined,
        created_at: new Date(user.created_at),
        updated_at: new Date(user.updated_at),
      };

      const createdUser = await prisma.users.create({
        data: userData,
      });

      // 学生プロフィールの作成
      if (user.studentProfile) {
        await prisma.studentProfile.create({
          data: {
            id: user.studentProfile.id,
            userId: user.studentProfile.userId,
            entryYear: user.studentProfile.entryYear,
            entryMonth: user.studentProfile.entryMonth as EntryMonth,
            plannedGradYear: user.studentProfile.plannedGradYear,
            plannedGradMonth: user.studentProfile.plannedGradMonth as GraduationMonth,
            status: user.studentProfile.status as StudentStatus,
            created_at: new Date(user.studentProfile.created_at),
            updated_at: new Date(user.studentProfile.updated_at),
          },
        });
      }

      return createdUser;
    })
  );

  return {
    labs,
    users,
  };
}