"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Card,
  CardHeader,
  CardBody,
  Icon,
  HStack,
  Avatar,
  Tag,
  TagLabel,
  Button,
  useColorModeValue,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import {
  FaArrowLeft,
  FaUsers,
  FaProjectDiagram,
  FaUserTie,
} from "react-icons/fa";
import Link from "next/link";
import { Lab, Users, Project } from "@/types";

interface LabDetailPageProps {
  lab: Lab;
  professor: Users;
}

export const LabDetailPage = ({ lab, professor }: LabDetailPageProps) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Container maxW="container.lg" py={8}>
      <Box mb={6}>
        <Button
          as={Link}
          href="/dashboard"
          leftIcon={<FaArrowLeft />}
          colorScheme="gray"
          variant="ghost"
          size="sm"
        >
          Back to Dashboard
        </Button>
      </Box>

      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="xl" mb={4}>
            {lab.name}
          </Heading>
          <Text color="gray.600" fontSize="lg">
            {lab.description}
          </Text>
        </Box>

        <Card>
          <CardHeader>
            <HStack>
              <Icon as={FaUserTie} color="blue.500" boxSize={5} />
              <Heading size="md">Professor</Heading>
            </HStack>
          </CardHeader>
          <CardBody pt={0}>
            <Tag
              size="lg"
              borderRadius="full"
              variant="subtle"
              colorScheme="blue"
            >
              <Avatar size="sm" name={professor.username} ml={-1} mr={2} />
              <TagLabel>{professor.username}</TagLabel>
            </Tag>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <HStack>
              <Icon as={FaUsers} color="blue.500" boxSize={5} />
              <Heading size="md">Members</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {lab.members.map((member: Users) => (
                    <Tr
                      key={member.id}
                      _hover={{ bg: "gray.50" }}
                      transition="background-color 0.2s"
                    >
                      <Td>
                        <HStack>
                          <Avatar size="sm" name={member.username} />
                          <Text>{member.username}</Text>
                        </HStack>
                      </Td>
                      <Td>{member.email}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <HStack>
              <Icon as={FaProjectDiagram} color="blue.500" boxSize={5} />
              <Heading size="md">Projects</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {lab.projects.map((project: Project) => (
                <Box
                  key={project.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  borderColor={borderColor}
                  bg={bgColor}
                  transition="all 0.2s"
                  _hover={{
                    shadow: "md",
                    transform: "translateY(-2px)",
                  }}
                  as={Link}
                  href={`/projects/${project.id}`}
                >
                  <Heading size="sm" mb={2}>
                    {project.title}
                  </Heading>
                  <Text color="gray.600" noOfLines={2}>
                    {project.description}
                  </Text>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};
