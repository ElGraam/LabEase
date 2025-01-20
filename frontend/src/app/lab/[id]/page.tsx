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
  SystemStyleObject,
} from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getLab } from "./action";
import { Users, Project } from "@/types";
import { authOption } from "@/lib/next-auth/auth";
// Lab detail page component
const LabPage = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOption);

  // Redirect to sign in page if not authenticated
  if (!session) {
    redirect("/auth/signin");
  }

  // Get lab information
  const res = await getLab(params.id);
  const { lab, professor, status } = res;
  if (status !== 200) {
    // Error handling
    return <div>Failed to retrieve laboratory information</div>;
  }

  // Style definitions
  const containerStyle: SystemStyleObject = {
    maxWidth: "1200px",
    margin: "60px auto",
    padding: "0 20px",
  };

  const headingStyle: SystemStyleObject = {
    fontSize: "app.header1",
    marginBottom: "30px",
  };

  return (
    <Box sx={containerStyle}>
      <VStack spacing={8} align="start" w="100%">
        <Heading as="h1" sx={headingStyle}>
          {lab.name}
        </Heading>

        <Box w="100%">
          <Heading as="h2" size="md" mb={4}>
            Laboratory Overview
          </Heading>
          <Text>{lab.description}</Text>
        </Box>

        <Box w="100%">
          <Heading as="h2" size="md" mb={4}>
            Supervisor
          </Heading>
          <Text>{professor.username}</Text>
        </Box>

        <Box w="100%">
          <Heading as="h2" size="md" mb={4}>
            Members List
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
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
            Projects List
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Project Name</Th>
                <Th>Description</Th>
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
