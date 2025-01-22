"use server";
import { AvailableSlot } from "@/types";

type responseData = {
  availableslot: AvailableSlot;
};

type responseData01 = {
  availableSlots: AvailableSlot[];
  totalCount: number;
};

export const createAvailableSlots = async (
  userId: string,
  dayOfWeek: number, // 曜日
  startTime: Date,
  endTime: Date,
): Promise<responseData> => {
  const path = `${process.env.BACKEND_URL}/api/availableslots/create/${userId}`;
  try {
    const startTimeString = new Date(startTime).toISOString();
    const endTimeString = new Date(endTime).toISOString();

    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dayOfWeek,
        startTime: startTimeString,
        endTime: endTimeString,
      }),
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ message: "Failed to parse error response" }));
      console.error("Server response:", {
        status: res.status,
        statusText: res.statusText,
        error: errorData,
      });
      throw new Error(
        errorData.message ||
          `Failed to create available slot: ${res.status} ${res.statusText}`,
      );
    }

    const data = await res.json();
    return { availableslot: data };
  } catch (error) {
    console.error("Error creating available slot:", {
      error,
      userId,
      dayOfWeek,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    });
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
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch available slots");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching available slots:", error);
    throw error;
  }
};

export const deleteAvailableSlot = async (
  availableSlotId: string,
): Promise<responseData> => {
  const path = `${process.env.BACKEND_URL}/api/availableslots/${availableSlotId}`;
  try {
    const res = await fetch(path, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete available slot");
    }
    const data = await res.json();
    return { availableslot: data };
  } catch (error) {
    console.error("Error deleting available slot:", error);
    throw error;
  }
};
