'use client'

import { useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Checkbox, Button } from '@chakra-ui/react';
import { labRegister } from '../action';

export default function StudentTable({ Users }: { Users: any[] }) {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const handleCheckboxChange = (studentId: string) => {
    setSelectedStudents((prevSelected) => {
      const newSelected = prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId];
      console.log('selectedStudents:', newSelected);
      return newSelected;
    });
  };
  const handleRegister = async () => {
    console.log('handleRegister called');
    for (const studentId of selectedStudents) {
      console.log(`studentId: ${studentId}`);
      await labRegister('lab01', studentId);
    }
    setSelectedStudents([]);
  };

  return (
    <>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>選択</Th>
            <Th>名前</Th>
            <Th>メール</Th>
            <Th>学生ID</Th>
            <Th>プログラム</Th>
            <Th>LabID</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Users.map((user: any) => (
            <Tr key={user.id}>
              <Td>
                <Checkbox
                  isChecked={selectedStudents.includes(user.studentId)}
                  onChange={() => handleCheckboxChange(user.studentId)}
                />
              </Td>
              <Td>{user.username}</Td>
              <Td>{user.email}</Td>
              <Td>{user.studentId}</Td>
              <Td>{user.program}</Td>
              <Td>{user.labId}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Button colorScheme="blue" onClick={handleRegister}>
        ラボに登録(lab01)
      </Button>
    </>
  );
}