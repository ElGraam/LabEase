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
    redirect("/auth/signin"); // ログインページへのパス
  }
  const labid = session.user.labId || ``;
  // クエリパラメータで指定された検索条件
  const keyword = searchParams?.keyword || "";
  const sort = searchParams?.sort || "studentId";
  const offset = Number(searchParams?.offset) || 0;

  // 指定された検索条件で学生情報を取得
  const res = keyword ? await getStudentBasedId(keyword) : await getStudents();

  const { Users, status } = res;
  const totalCount = status === 200 ? Users.length : 0;
  const resultText = totalCount
    ? `${totalCount}件の学生が見つかりました`
    : "学生が見つかりませんでした";

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
        学生登録一覧
      </Heading>
      <Text>{resultText}</Text>
      <StudentTable Users={Users} />
      <Pagination keyword={keyword} offset={offset} totalCount={totalCount} />
    </VStack>
  );
};

export default StudentList;
