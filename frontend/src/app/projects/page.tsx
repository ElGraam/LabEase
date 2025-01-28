import { Heading, VStack, Button, Link } from "@chakra-ui/react";
import { redirect } from "next/navigation";
import ProjectList from "./_components/ProjectList";
import { getLabProject } from "./action";
import { authOption } from "@/lib/next-auth/auth";
import { getServerSession } from "next-auth/next";
import { getProjects } from "./action";
import { Project } from "@/types";
const ProjectsPage = async () => {
  const serversession = await getServerSession(authOption);

  if (!serversession) {
    redirect("/auth/signin");
  }
  const labId = serversession.user.labId || "";
  const role = serversession.user.role || "";
  const userId = serversession.user.id || "";
  let projects: Project[] = [];
  if (role === "STUDENT") {
    const response = await getProjects(userId);
    projects = response.project;
  } else {
    const response = await getLabProject(labId);
    projects = response.project;
  }

  return (
    <VStack spacing={6} align="stretch" p={6}>
      <Heading as="h1" size="xl" mb={4}>
        Projects
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
