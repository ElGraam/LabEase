// Enums
export { Role, ProgramType ,StudentStatus ,EntryMonth ,GraduationMonth ,ProjectMilestoneStatus ,MeetingType} from '@prisma/client';

// Types
export type Users = {
  id: string;
  username: string;
  password: string;
  email: string;
  role: import('@prisma/client').Role;  // Prismaの型を直接参照
  studentId?: string;
  program?: import('@prisma/client').ProgramType;  // Prismaの型を直接参照
  studentProfile?: StudentProfile;
  labId?: string;
  lab?: Lab;
  assignedProjects: ProjectMember[];
  availableSlots: AvailableSlot[];
  meetings: MeetingParticipant[];
  created_at: Date;
  updated_at: Date;
};

export type StudentProfile = {
  id: string;
  userId: string;
  user: Users;
  entryYear: number;
  entryMonth: import('@prisma/client').EntryMonth;  // Prismaの型を直接参照
  plannedGradYear: number;
  plannedGradMonth: import('@prisma/client').GraduationMonth; // Prismaの型を直接参照
  status: import('@prisma/client').StudentStatus; // Prismaの型を直接参照
  created_at: Date;
  updated_at: Date;
};

export type Lab = {
  id: string;
  name: string;
  description?: string;
  professorId: string;
  members: Users[];
  projects: Project[];
  created_at: Date;
  updated_at: Date;
};

export type Project = {
  id: string;
  title: string;
  description?: string;
  labId: string;
  lab: Lab;
  members: ProjectMember[];
  milestones: ProjectMilestone[];
  created_at: Date;
  updated_at: Date;
};

export type ProjectMilestone = {
  id: string;
  projectId: string;
  project: Project;
  title: string;
  description?: string;
  dueDate: Date;
  status: import('@prisma/client').ProjectMilestoneStatus; // Prismaの型を直接参照
  completionDate?: Date;
  created_at: Date;
  updated_at: Date;
};

export type ProjectMember = {
  id: string;
  projectId: string;
  project: Project;
  userId: string;
  user: Users;
  created_at: Date;
  updated_at: Date;
};

export type AvailableSlot = {
  id: string;
  userId: string;
  user: Users;
  dayOfWeek: number;
  startTime: Date;
  endTime: Date;
  created_at: Date;
  updated_at: Date;
};

export type Meeting = {
  id: string;
  type: import('@prisma/client').MeetingType; // Prismaの型を直接参照
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  participants: MeetingParticipant[];
  created_at: Date;
  updated_at: Date;
};

export type MeetingParticipant = {
  id: string;
  meetingId: string;
  meeting: Meeting;
  userId: string;
  user: Users;
  created_at: Date;
  updated_at: Date;
};

// 認証のための型定義
export type AuthUserInfo = {
  id: string;
  email: string;
  role: import('@prisma/client').Role;  // Prismaの型を直接参照
  username: string;
  labId?: string;
};

