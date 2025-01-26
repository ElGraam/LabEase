"use client";
import {
  Box,
  VStack,
  Text,
  Button,
  Stack,
  Badge,
  Heading,
  Container,
  useColorModeValue,
  Icon,
  HStack,
  Divider,
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Flex,
  Tag,
  TagLabel,
  Progress,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Project, Users } from "@/types";
import { FiCalendar, FiEdit2, FiUsers } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

const ProjectDetailView = ({
  projectId,
  projectData,
  labMembers,
}: {
  projectId: string;
  projectData: Project;
  labMembers: Users[];
}) => {
  const { data: session } = useSession();
  const router = useRouter();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const getProjectProgress = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return 100;
      case "IN_PROGRESS":
        return 25;
      default:
        return 0;
    }
  };

  const completedMilestones = projectData.milestones.filter(
    (m) => m.status === "COMPLETED",
  ).length;
  const totalMilestones = projectData.milestones.length;
  const overallProgress = (completedMilestones / totalMilestones) * 100;

  return (
    <Container maxW="container.lg" py={8}>
      <Box mb={6}>
        <Button
          as={Link}
          href="/projects"
          leftIcon={<FaArrowLeft />}
          colorScheme="gray"
          variant="ghost"
          size="sm"
        >
          Back to projects list
        </Button>
      </Box>
      <VStack spacing={8} align="stretch">
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="lg" mb={2}>
              {projectData.title}
            </Heading>
            <Text color="gray.600" fontSize="md">
              {projectData.description}
            </Text>
          </Box>
          {session?.user?.role !== "STUDENT" && (
            <Button
              leftIcon={<Icon as={FiEdit2} />}
              onClick={() => router.push(`/projects/${projectId}/edit`)}
              colorScheme="blue"
              variant="outline"
            >
              Edit
            </Button>
          )}
        </Flex>

        <Card>
          <CardHeader>
            <HStack justify="space-between">
              <Heading size="md">Overall Progress</Heading>
              <Text color="gray.600">
                {completedMilestones} / {totalMilestones} Milestones Completed
              </Text>
            </HStack>
          </CardHeader>
          <CardBody pt={0}>
            <Progress
              value={overallProgress}
              size="lg"
              colorScheme="blue"
              borderRadius="full"
              hasStripe
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Milestones</Heading>
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              {projectData.milestones.map((milestone) => (
                <Box
                  key={milestone.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  borderColor={borderColor}
                  bg={bgColor}
                  transition="all 0.2s"
                  _hover={{ shadow: "md" }}
                >
                  <HStack justify="space-between" mb={2}>
                    <Heading size="sm">{milestone.title}</Heading>
                    <Badge
                      colorScheme={
                        milestone.status === "COMPLETED"
                        ? "green"
                        : milestone.status === "IN_PROGRESS"
                          ? "blue"
                          : milestone.status === "PLANNED"
                            ? "yellow"
                            : "red"
                      }
                      borderRadius="full"
                      px={3}
                      py={1}
                    >
                      {milestone.status}
                    </Badge>
                  </HStack>
                  <Text color="gray.600" mb={3}>
                    {milestone.description}
                  </Text>
                  <Stack spacing={2}>
                    <Progress
                      value={getProjectProgress(milestone.status)}
                      size="sm"
                      colorScheme="blue"
                      borderRadius="full"
                    />
                    <HStack spacing={4}>
                      <HStack>
                        <Icon as={FiCalendar} color="gray.500" />
                        <Text fontSize="sm" color="gray.600">
                          Due:{" "}
                          {new Date(milestone.dueDate).toLocaleDateString(
                            "ja-JP",
                          )}
                        </Text>
                      </HStack>
                      {milestone.completionDate && (
                        <HStack>
                          <Icon as={FiCalendar} color="green.500" />
                          <Text fontSize="sm" color="green.600">
                            Completed:{" "}
                            {new Date(
                              milestone.completionDate,
                            ).toLocaleDateString("ja-JP")}
                          </Text>
                        </HStack>
                      )}
                    </HStack>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <HStack>
              <Icon as={FiUsers} />
              <Heading size="md">Project Members</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <Flex wrap="wrap" gap={4}>
              {labMembers
                .filter((member) =>
                  projectData.members?.some((m) => m.userId === member.id),
                )
                .map((member) => (
                  <Tag
                    key={member.id}
                    size="lg"
                    borderRadius="full"
                    variant="subtle"
                    colorScheme="blue"
                  >
                    <Avatar size="xs" name={member.username} ml={-1} mr={2} />
                    <TagLabel>{member.username}</TagLabel>
                  </Tag>
                ))}
            </Flex>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default ProjectDetailView;
