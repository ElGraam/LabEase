"use client";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Tag } from "@chakra-ui/react";
import Link from "next/link";
import { useSession } from "next-auth/react"; // ログイン情報を取得するために追加
import { Project } from "@/types";
type Props = {
  projects: Project[];
};

const ProjectList = ({ projects }: Props) => {
  const { data: session } = useSession(); // セッションからユーザー情報を取得
  if (!session) return <p>ログインしてください。</p>;

  const labId = session.user.labId ?? ""; // ログイン中のユーザーのLabID
  const userRole = session.user.role; // ユーザーのroleを取得

  if (userRole == "STUDENTS") {
  }
  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>プロジェクト名</Th>
            <Th>説明</Th>
            <Th>マイルストーン</Th>
            <Th>ステータス</Th>
            <Th>期限</Th>
            <Th>達成した日</Th>
          </Tr>
        </Thead>
        <Tbody>
          {projects.map((project) => (
            <Tr key={project.id}>
              <Td>
                <Link href={`/projects/${project.id}`}>{project.title}</Link>
              </Td>
              <Td>{project.description}</Td>
              <Td>
                {/* プロジェクトのステータスをタグで表示 */}
                {project.milestones &&
                  project.milestones[0] &&
                  project.milestones[0].description}
              </Td>
              <Td>
                {/* マイルストーンのステータスをタグで表示 */}
                {project.milestones &&
                  project.milestones.map((milestone) => (
                    <Tag key={milestone.id} colorScheme="blue" mr={1}>
                      {milestone.status}
                    </Tag>
                  ))}
              </Td>
              <Td>
                {new Date(project.milestones?.[0]?.dueDate).toLocaleDateString(
                  "ja-JP",
                  {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  },
                )}
              </Td>
              <Td>
                {new Date(
                  project.milestones?.[0]?.completionDate ?? "",
                ).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  timeZone: "Asia/Tokyo",
                })}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ProjectList;
