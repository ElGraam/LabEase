'use server';
import { Lab, Users } from '@/types';

type responseData = {
    lab: Lab;
    status: number;
    professor: Users;  
};

export const getLab = async (
    labId: string
): Promise<responseData> => {
    const path = `${process.env.BACKEND_URL}/api/lab/${labId}`;

    try {
        const res = await fetch(path, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-cache',
        });

        const data = await res.json();
        const status = res.status;

        // labとprofessorの情報を含むデータを返却
        if (status === 200) {
            return { 
                status, 
                lab: {
                    ...data,  // lab情報とメンバー、プロジェクト情報
    
                } ,
                professor: data.professor // 教授情報
            };
        }

        return {
            status,
            lab: {} as Lab,
            professor: {} as Users
        };

    } catch (error) {
        console.log(error);
        return {
            status: 500,
            lab: {} as Lab,
            professor: {} as Users
        };
    }
};
