"use server";
import { Meeting } from "@/types";
import { Project } from "@/types";
import { AvailableSlot } from "@/types";
type responseData = {
    meetings: Meeting[];
  };
type projectData = {
    projects: Project[];
  };
type responseData01 = {
    availableSlots: AvailableSlot[];
    totalCount: number;
  };
export const getMeetings = async (userId: string): Promise<responseData> => {
    const path = `${process.env.BACKEND_URL}/api/meeting/user/${userId}`;
    try {
      const res = await fetch(path, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      const data = await res.json();
      return { meetings: data };
    } catch (error) {
      console.error(error);
      throw error;
    }
};
export const getProjects = async (userId: string): Promise<projectData> => {
    const path = `${process.env.BACKEND_URL}/api/project/user/${userId}`;
    try {
      const res = await fetch(path, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      const data = await res.json();
      return { projects: data };
    } catch (error) {
      console.error(error);
      throw error;
    }
};
export const getAvailableSlots = async (
    userId: string,
    offset: number,
    limit: number,
  ): Promise<responseData01> => {
    const path = `${process.env.BACKEND_URL}/api/availableslots/${userId}?offset=${offset}&limit=${limit}`;
    try {
      const res = await fetch(path, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

