'use server';
import { Project, ProjectMilestone ,ProjectMilestoneStatus, Users} from '@/types';

/** getProjectとupdateProjectで返却する値の型 */
type responseData = {
  project: Project;
  status: number;
};
/** getLabMenbersで返却する値の型 */
type responseData01 = {
  status: number;
  members: Users[];
};
export const getProject = async (projectId:string) : Promise<responseData> => {

    const path = `${process.env.BACKEND_URL}/api/project/${projectId}`;
  
    try {
      const res = await fetch(path, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await res.json();
      console.log(data);  
      return {
        status: res.status,
        project: data
      };
  
    } catch (error) {
      console.log(error);
      throw error;
    }
}

export const updateProject = async (
  title: string,
  description: string,
  milestones: { title: string; description: string; status: ProjectMilestoneStatus; dueDate: Date }[],
  projectId: string
): Promise<responseData> => {
  const path = `${process.env.BACKEND_URL}/api/project/${projectId}`;
  const project = { title, description, milestones };

  try {
    const res = await fetch(path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
    return res.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getLabMenbers = async (labId: string) : Promise<responseData01> => {
  const path = `${process.env.BACKEND_URL}/api/lab/${labId}/members`;

  try {
    const res = await fetch(path, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    const status = res.status;
    const members = Array.isArray(data) ? data : [data]; // データが配列でない場合、配列に変換
    return { status, members };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const projectRegister = async (
  projectId: string,
  memberIds: string[]
): Promise<responseData> => {
  const path = `${process.env.BACKEND_URL}/api/project/register`;
  const project = { projectId, memberIds };

  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
    return res.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}