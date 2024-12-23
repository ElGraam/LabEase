'use client';

import { Project } from '@/types';
import Link from 'next/link';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Tag } from '@chakra-ui/react'; 
import { useSession } from 'next-auth/react'; // ログイン情報を取得するために追加
type Props = {
  projects: Project[];
};

const ProjectList = ({ projects }: Props) => {
  const { data: session, status } = useSession(); // セッションからユーザー情報を取得
  if (!session) return <p>ログインしてください。</p>;

  const labId = session.user.labId ?? ''; // ログイン中のユーザーのLabID
  const userRole = session.user.role; // ユーザーのroleを取得
  
  if (userRole == 'STUDENTS') {

  }
  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>プロジェクト名</Th>
            <Th>説明</Th>
            <Th>ステータス</Th>
            <Th>メンバー数</Th>
            <Th>作成日</Th>
            <Th>最終更新日</Th>
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
                {/* マイルストーンのステータスをタグで表示 */}
                {project.milestones && project.milestones.map((milestone) => (
                  <Tag key={milestone.id} colorScheme="blue" mr={1}>
                    {milestone.status}
                  </Tag>
                ))}
              </Td>
              <Td>{project.milestones?.length}</Td>
              <Td>{new Date(project.created_at).toLocaleString()}</Td>
              <Td>{new Date(project.updated_at).toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ProjectList;