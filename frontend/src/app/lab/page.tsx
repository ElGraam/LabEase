import Pagination from "@/app/lab/_components/Pagination";
import {
  Heading,
  SystemStyleObject,
  Text,
  VStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import SearchBox from "./_components/SearchBox";

import { ITEM_LIMIT } from "@/const";
import { getStudentBasedId } from "@/app/lab/action";
import { getStudents } from "./action";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import StudentTable from "./_components/StudentTable";

const StudentList = async ({
  searchParams,
}: {
  searchParams?: {
    sort?: string;
    keyword?: string;
    offset?: string;
  };
}) => {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/signin"); // Path to login page
  }
  const labid = session.user.labId || ``;
  // Search conditions specified by query parameters
  const keyword = searchParams?.keyword || "";
  const sort = searchParams?.sort || "studentId";
  const offset = Number(searchParams?.offset) || 0;

  // Get student information based on specified search conditions
  const res = keyword
    ? await getStudentBasedId(keyword)
    : await getStudents(offset);

  const { Users, status, totalCount } = res;
  const resultText =
    status === 200
      ? `${totalCount} students found (Displaying ${offset + 1} to ${Math.min(offset + ITEM_LIMIT, totalCount)})`
      : "No students found";

  const vStackStyle: SystemStyleObject = {
    margin: "60px auto",
    width: "100%",
    gap: "30px",
  };

  const titleStyle: SystemStyleObject = {
    fontSize: "app.header1",
  };

  return (
    <VStack sx={vStackStyle}>
      <SearchBox isBookmark={false} />
      <Heading as="h2" sx={titleStyle}>
        Student Registration
      </Heading>
      <Text>{resultText}</Text>
      <StudentTable Users={Users} />
      <Pagination keyword={keyword} offset={offset} totalCount={totalCount} />
    </VStack>
  );
};

export default StudentList;
