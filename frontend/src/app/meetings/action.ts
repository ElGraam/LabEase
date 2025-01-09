"use server";
import { Meeting } from "@/types";

type responseData = {
  meetings: Meeting[];
};

export const getMeetings = async (userId: string): Promise<responseData> => {
  const path = `${process.env.BACKEND_URL}/api/meeting/${userId}`;
  try {
    const res = await fetch(path, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    return { meetings: data };
  } catch (error) {
    console.error(error);
    throw error;
  }
};