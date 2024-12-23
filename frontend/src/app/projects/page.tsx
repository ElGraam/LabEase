// src/app/projects/page.tsx
import { getServerSession } from 'next-auth/next';
import { authOption } from '@/lib/next-auth/auth'; 
import { redirect } from 'next/navigation';
import { getLabProject } from './action';
import ProjectList from './_components/ProjectList';
import { Heading, VStack, Button ,Link} from '@chakra-ui/react';
const ProjectsPage = async () => {
  const serversession = await getServerSession(authOption);
  console.log("getServerSession result:", serversession); // サーバーサイドでセッションを確認

  if (!serversession) {
    redirect('/auth/signin');
  }
  const labId = serversession.user.labId || '';
  console.log("labId:", labId); // labIdを確認
  const response = await getLabProject(labId);
  const projects = response.project;

  return (
    <VStack spacing={6} align="stretch" p={6}>
      <Heading as="h1" size="xl">プロジェクト一覧</Heading>
      <Link href="/projects/create">
        <Button colorScheme="blue" alignSelf="flex-end">
          新しいプロジェクトを作成
        </Button>
      </Link>
      <ProjectList projects={projects} />
    </VStack>
  );
};

export default ProjectsPage;