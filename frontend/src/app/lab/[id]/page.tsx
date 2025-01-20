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
  Card,
  CardBody,
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

  // Static style definitions
  const containerStyle: SystemStyleObject = {
    maxWidth: "1200px",
    margin: "60px auto",
    padding: "0 20px",
    bg: "gray.50",
    minHeight: "100vh",
  };

  const headingStyle: SystemStyleObject = {
    fontSize: ["2xl", "3xl", "4xl"],
    fontWeight: "bold",
    marginBottom: "30px",
    color: "blue.600",
    borderBottom: "4px solid",
    borderColor: "blue.400",
    paddingBottom: "8px",
  };

  const cardStyle: SystemStyleObject = {
    w: "100%",
    bg: "white",
    boxShadow: "xl",
    rounded: "xl",
    p: 6,
    mb: 4,
    transition: "all 0.3s ease",
    _hover: {
      transform: "translateY(-2px)",
      boxShadow: "2xl",
    },
  };

  const tableStyle: SystemStyleObject = {
    bg: "white",
    borderRadius: "lg",
    overflow: "hidden",
    boxShadow: "sm",
    w: "100%",
  };

  return (
    <Box sx={containerStyle}>
      <VStack spacing={8} align="start" w="100%">
        <Heading as="h1" sx={headingStyle}>
          {lab.name}
        </Heading>

        <Card sx={cardStyle}>
          <CardBody>
            <Heading as="h2" size="md" mb={4} color="blue.600">
              Laboratory Overview
            </Heading>
            <Text color="gray.700" fontSize="lg" lineHeight="tall">
              {lab.description}
            </Text>
          </CardBody>
        </Card>

        <Card sx={cardStyle}>
          <CardBody>
            <Heading as="h2" size="md" mb={4} color="blue.600">
              Supervisor
            </Heading>
            <Text color="gray.700" fontSize="lg" display="flex" alignItems="center" gap={2}>
              <Box as="span" color="blue.500"></Box>
              {professor.username}
            </Text>
          </CardBody>
        </Card>

        <Card sx={cardStyle}>
          <CardBody>
            <Heading as="h2" size="md" mb={4} color="blue.600">
              Members List
            </Heading>
            <Box sx={tableStyle}>
              <Table variant="simple">
                <Thead bg="blue.50">
                  <Tr>
                    <Th color="blue.600">Name</Th>
                    <Th color="blue.600">Email</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {lab.members.map((member: Users) => (
                    <Tr 
                      key={member.id} 
                      _hover={{ bg: "blue.50" }}
                      transition="background-color 0.2s"
                    >
                      <Td fontWeight="medium">{member.username}</Td>
                      <Td>{member.email}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </CardBody>
        </Card>

        <Card sx={cardStyle}>
          <CardBody>
            <Heading as="h2" size="md" mb={4} color="blue.600">
              Projects List
            </Heading>
            <Box sx={tableStyle}>
              <Table variant="simple">
                <Thead bg="blue.50">
                  <Tr>
                    <Th color="blue.600">Project Name</Th>
                    <Th color="blue.600">Description</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {lab.projects.map((project: Project) => (
                    <Tr 
                      key={project.id} 
                      _hover={{ bg: "blue.50" }}
                      transition="background-color 0.2s"
                    >
                      <Td fontWeight="medium">{project.title}</Td>
                      <Td>{project.description}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};
export default LabPage;
