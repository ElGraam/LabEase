"use server";
import { Project } from "@/types";

/** getStudentsで返却する値の型 */
type responseData = {
  project: Project[];
  status: number;
};

type response = {
  project: Project;
};

export const getLabProject = async (labId: string): Promise<responseData> => {
  const path = `${process.env.BACKEND_URL}/api/lab/${labId}/projects`;

  try {
    const res = await fetch(path, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    const Projects = Array.isArray(data) ? data : [data]; // データが配列でない場合、配列に変換

    return {
      status: res.status,
      project: Projects,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteProject = async (projectId: string): Promise<response> => {
  const path = `${process.env.BACKEND_URL}/api/project/${projectId}`;

  try {
    const res = await fetch(path, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    return {
      project: data,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
