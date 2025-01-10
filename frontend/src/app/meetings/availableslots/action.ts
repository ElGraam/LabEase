"use server";
import { AvailableSlot } from "@/types";

type responseData = {
  availableslot: AvailableSlot;
};

type responseData01 = {
  availableslot: AvailableSlot[];
};

export const createAvailableSlots = async (
  userId: string,
  dayOfWeek: string,
  startTime: Date,
  endTime: Date,
): Promise<responseData> => {
  const path = `${process.env.BACKEND_URL}/api/availableslots/create/${userId}`;
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dayOfWeek, startTime, endTime }),
    });
    const data = await res.json();
    return { availableslot: data };
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
  try{
    const res = await fetch(path, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    return { availableslot: data };
  } catch (error) {
    console.error(error);
    throw error;
  }
};