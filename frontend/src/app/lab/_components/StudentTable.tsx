"use client";

import { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Button,
  Box,
  Hide,
} from "@chakra-ui/react";
import { labRegister } from "../action";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function StudentTable({ Users }: { Users: any[] }) {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const { data: session, status } = useSession(); // セッションからユーザー情報を取得
  if (!session) redirect("/auth/signin");
  const labId = session.user.labId ?? "";
  const handleCheckboxChange = (studentId: string) => {
    setSelectedStudents((prevSelected) => {
      const newSelected = prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId];
      return newSelected;
    });
  };

  const handleRegister = async () => {
    for (const studentId of selectedStudents) {
      if (labId) {
        await labRegister(labId, studentId);
      }
    }
    setSelectedStudents([]);
  };

  return (
    <Box>
      <Box overflowX="auto">
        <Table variant="simple" size={{ base: "sm", md: "md" }}>
          <Thead>
            <Tr>
              <Th width="60px">選択</Th>
              <Th width={{ base: "120px", md: "auto" }}>名前</Th>
              <Hide below="md">
                <Th>メール</Th>
              </Hide>
              <Th width={{ base: "100px", md: "auto" }}>学生ID</Th>
              <Hide below="md">
                <Th>プログラム</Th>
              </Hide>
              <Hide below="md">
                <Th>LabID</Th>
              </Hide>
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
                <Hide below="md">
                  <Td>{user.email}</Td>
                </Hide>
                <Td>{user.studentId}</Td>
                <Hide below="md">
                  <Td>{user.program}</Td>
                </Hide>
                <Hide below="md">
                  <Td>{user.labId}</Td>
                </Hide>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Box mt={4} mb={8} textAlign="center">
        <Button colorScheme="blue" onClick={handleRegister}>
          ラボに登録({selectedStudents.length}人)
        </Button>
      </Box>
    </Box>
  );
}
