// Enums
export enum Role {
  STUDENT = 'STUDENT',
  PROFESSOR = 'PROFESSOR', 
  SUB_INSTRUCTOR = 'SUB_INSTRUCTOR'
}

export enum ProgramType {
  UNDERGRADUATE = 'UNDERGRADUATE',
  MASTERS = 'MASTERS',
  DOCTORAL = 'DOCTORAL'
}

export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  GRADUATED = 'GRADUATED',
  WITHDRAWN = 'WITHDRAWN'
}

export enum EntryMonth {
  APRIL = 'APRIL',
  OCTOBER = 'OCTOBER'
}

export enum GraduationMonth {
  MARCH = 'MARCH',
  SEPTEMBER = 'SEPTEMBER'
}

export enum ProjectMilestoneStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  LATE = 'LATE',
  COMPLETED = 'COMPLETED'
}

export enum MeetingType {
  REGULAR = 'REGULAR',
  SPONTANEOUS = 'SPONTANEOUS'
}

// Types
export type Users = {
  id: string;
  username: string;
  password: string;
  email: string;
  role: Role;
  studentId?: string;
  program?: ProgramType;
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
  entryMonth: EntryMonth;
  plannedGradYear: number;
  plannedGradMonth: GraduationMonth;
  status: StudentStatus;
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
  status: ProjectMilestoneStatus;
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
  type: MeetingType;
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


  