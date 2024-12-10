import {
    Heading,
    Box,
    Text,
    VStack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    SystemStyleObject
  } from '@chakra-ui/react';import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getLab } from './action';
import { Users, Project } from '@/types';
// ラボ詳細ページのコンポーネント
const LabPage = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession();

  // 未認証の場合はサインインページにリダイレクト
  if (!session) {
    redirect('/auth/signin');
  }

  // ラボ情報を取得
  const res = await getLab(params.id);
  const { lab, professor, status } = res;
  if (status !== 200) {
    // エラーハンドリング
    return <div>研究室情報の取得に失敗しました</div>;
  }


  // スタイル定義
  const containerStyle: SystemStyleObject = {
    maxWidth: '1200px',
    margin: '60px auto',
    padding: '0 20px',
  };

  const headingStyle: SystemStyleObject = {
    fontSize: 'app.header1',
    marginBottom: '30px',
  };

  return (
    <Box sx={containerStyle}>
      <VStack spacing={8} align="start" w="100%">
        <Heading as="h1" sx={headingStyle}>
          {lab.name}
        </Heading>
        
        <Box w="100%">
          <Heading as="h2" size="md" mb={4}>
            研究室概要
          </Heading>
          <Text>{lab.description}</Text>
        </Box>
  
        <Box w="100%">
          <Heading as="h2" size="md" mb={4}>
            指導教員
          </Heading>
          <Text>{professor.username}</Text> 
        </Box>
  
        <Box w="100%">
          <Heading as="h2" size="md" mb={4}>
            メンバー一覧
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>名前</Th>
                <Th>メールアドレス</Th>
                <Th>役割</Th>
              </Tr>
            </Thead>
            <Tbody>
              {lab.members.map((member: Users) => (
                <Tr key={member.id}>
                  <Td>{member.username}</Td>
                  <Td>{member.email}</Td>
                  <Td>{member.role}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
  
        <Box w="100%">
          <Heading as="h2" size="md" mb={4}>
            プロジェクト一覧
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>プロジェクト名</Th>
                <Th>説明</Th>
              </Tr>
            </Thead>
            <Tbody>
              {lab.projects.map((project: Project) => (
                <Tr key={project.id}>
                  <Td>{project.title}</Td>
                  <Td>{project.description}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Box>
  );
};
export default LabPage;