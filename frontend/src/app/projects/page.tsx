import { Heading, VStack, Button, Link } from "@chakra-ui/react";
import { redirect } from "next/navigation";
import ProjectList from "./_components/ProjectList";
import { getLabProject } from "./action";
import { authOption } from "@/lib/next-auth/auth";
import { getServerSession } from "next-auth/next";

const ProjectsPage = async () => {
  const serversession = await getServerSession(authOption);

  if (!serversession) {
    redirect("/auth/signin");
  }
  const labId = serversession.user.labId || "";
  const role = serversession.user.role || "";
  const response = await getLabProject(labId);
  const projects = response.project;

  return (
    <VStack spacing={6} align="stretch" p={6}>
      <Heading as="h1" size="xl" mb={4}>
        Projects List
      </Heading>
      {role !== "STUDENT" && (
        <Link href="/projects/create">
          <Button colorScheme="blue" alignSelf="flex-end">
            Create New Project
          </Button>
        </Link>
      )}
      <ProjectList projects={projects} />
    </VStack>
  );
};

export default ProjectsPage;
