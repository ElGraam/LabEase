"use server";

import { Project, Users } from "@/types";

/** projectCreateで返却する値の型 */
type responseData = {
  project: Project[];
  status: number;
};

type responseData01 = {
  status: number;
  members: Users[];
};

export const projectCreate = async (
  title: string,
  description: string,
  labId: string,
  milestones: { title: string; description: string; dueDate: Date }[],
  memberIds: string[],
): Promise<responseData> => {
  const path = `${process.env.BACKEND_URL}/api/project/create`;

  try {
    const res = await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        labId,
        milestones,
        memberIds,
      }),
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

export const getLabMenbers = async (labId: string): Promise<responseData01> => {
  const path = `${process.env.BACKEND_URL}/api/lab/${labId}/members`;

  try {
    const res = await fetch(path, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const data = await res.json();
    const status = res.status;
    const members = Array.isArray(data) ? data : [data]; // データが配列でない場合、配列に変換
    return { status, members };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
