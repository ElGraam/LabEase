'use server';

import { Project, ProjectMilestone } from '@/types';

/** projectCreateで返却する値の型 */
type responseData = {
  project: Project[];
  status: number;
};

export const projectCreate = async (
  title: string,
  description: string,
  labId: string,
  milestones: { title: string; description: string; dueDate: Date }[]
): Promise<responseData> => {
  const path = `${process.env.BACKEND_URL}/api/project/create`;

  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, labId, milestones }),
    });
    console.log(res);
    const data = await res.json();
    const Projects = Array.isArray(data) ? data : [data];

    return {
      status: res.status,
      project: Projects,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};