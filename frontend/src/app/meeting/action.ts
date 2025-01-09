"use server";

/** getMeetingで返却する値の型 */

export const getMeetings = async (userId: string) => {
  const path = `${process.env.BACKEND_URL}/api/meeting/${userId}`;
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return res.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
};