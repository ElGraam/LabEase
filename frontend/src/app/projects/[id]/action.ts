'use server';
import { Project, ProjectMilestone ,ProjectMilestoneStatus} from '@/types';

/** getProjectで返却する値の型 */
type responseData = {
  project: Project;
  status: number;
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