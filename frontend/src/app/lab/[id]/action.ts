"use server";
import { Lab, Users, Role } from "@/types";

type responseData = {
  lab: Lab;
  status: number;
  professor: Users;
};

export const getLab = async (labId: string): Promise<responseData> => {
  const path = `${process.env.BACKEND_URL}/api/lab/${labId}`;

  try {
    const res = await fetch(path, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
    });

    const data = await res.json();
    const status = res.status;

    if (status === 200) {
      // メンバーをroleで並び替え
      const sortedMembers = data.members?.sort((a: Users, b: Users) => {
        // roleの優先順位を定義
        const roleOrder = {
          [Role.PROFESSOR]: 1,
          [Role.SUB_INSTRUCTOR]: 2,
          [Role.STUDENT]: 3,
        };

        // roleの優先順位で比較
        const orderDiff = roleOrder[a.role] - roleOrder[b.role];
        if (orderDiff !== 0) return orderDiff - 1;

        // 同じroleの場合は名前で並び替え
        return a.username.localeCompare(b.username);
      });

      return {
        status,
        lab: {
          ...data,
          members: sortedMembers,
        },
        professor: data.professor,
      };
    }

    return {
      status,
      lab: {} as Lab,
      professor: {} as Users,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      lab: {} as Lab,
      professor: {} as Users,
    };
  }
};
