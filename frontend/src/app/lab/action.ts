'use server';
import { ITEM_LIMIT } from '@/const';
import { Users } from '@/types';

/** getStudentsで返却する値の型 */
type responseData = {
  Users: Users[];
  status: number;
};
export const labRegister = async (labId: string, studentId: string) => {
  const path = `${process.env.BACKEND_URL}/api/lab/register`;
  const body = JSON.stringify({ labId, studentId });
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    return res.status;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
/** 学生取得処理 */
export const getStudents = async (
  limit: number = ITEM_LIMIT
): Promise<responseData> => {
  const path = `${process.env.BACKEND_URL}/api/role/STUDENT`;

  try {
    // backendにGETリクエストして、学生を取得する
    const res = await fetch(path, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-cache',
    });
    
    // ステータスコード、取得した学生数を返却
    const data = await res.json();
    const status = res.status;
    const Users = Array.isArray(data) ? data : [data]; // データが配列でない場合、配列に変換
    return { status, Users };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getStudentBasedId = async (studentId: string) => {
  const path = `${process.env.BACKEND_URL}/api/student/${studentId}`;

  try {
    // backendにGETリクエストして、学生を取得する
    const res = await fetch(path, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-cache',
    });
    
    // ステータスコード、取得した学生数を返却
    const data = await res.json();
    const status = res.status;
    const Users = Array.isArray(data) ? data : [data]; // データが配列でない場合、配列に変換
    return { status, Users };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
