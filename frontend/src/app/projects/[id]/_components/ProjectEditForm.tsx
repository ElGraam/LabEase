"use client";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Box,
  Checkbox,
  CheckboxGroup,
  Stack,
  Select,
  Container,
  Card,
  CardHeader,
  CardBody,
  Heading,
  IconButton,
  Tooltip,
  useToast,
  Grid,
  GridItem,
  HStack,
  Avatar,
  Text,
  Badge,
} from "@chakra-ui/react";
import { redirect, useRouter } from "next/navigation";
import { FiSave, FiUserPlus } from "react-icons/fi";

import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  updateProject,
  projectRegister,
} from "../action";
import {
  Project,
  ProjectMilestone,
  ProjectMilestoneStatus,
  Users,
} from "@/types";

const ProjectEditForm = ({ 
  projectId,
  projectData,
  labMembers,
}: { 
  projectId: string;
  projectData: Project;
  labMembers: Users[];
}) => {
  const { data: session, status } = useSession();
  if (!session) redirect("/auth/signin");

  const [success, setSuccess] = useState("");
  const [title, setTitle] = useState(projectData.title);
  const [description, setDescription] = useState(projectData.description || "");
  const [milestones, setMilestones] = useState<ProjectMilestone[]>(projectData.milestones);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [registeredMembers, setRegisteredMembers] = useState<string[]>(
    projectData.members ? projectData.members.map((m: any) => m.userId) : []
  );
  const router = useRouter();
  const toast = useToast();

  const handleMilestoneChange = (
    index: number,
    field: keyof ProjectMilestone,
    value: any,
  ) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      [field]: value,
    };
    setMilestones(updatedMilestones);
    router.refresh();
  };

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedMilestones = milestones.map((milestone) => ({
        title: milestone.title,
        description: milestone.description || "",
        status: milestone.status,
        dueDate: milestone.dueDate,
      }));
      if (session?.user?.role != "STUDENT") {
        await updateProject(title, description, formattedMilestones, projectId);
        setSuccess("Project updated successfully");
        showSuccessToast("Project updated successfully");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = async () => {
    try {
      if (session?.user?.role != "STUDENT") {
        await projectRegister(projectId, selectedMemberIds);
        setSuccess("Members registered successfully");
        showSuccessToast("Members registered successfully");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMemberSelect = (values: string[]) => {
    setSelectedMemberIds(values);
    
  };

  const showSuccessToast = (message: string) => {
    toast({
      title: "Success",
      description: message,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  if (!projectData) return <Box>Loading...</Box>;

  return (
    <Container maxW="container.lg" py={8}>
      <form onSubmit={handleEditProject}>
        <VStack spacing={6}>
          <Card w="100%">
            <CardHeader>
              <Heading size="md">Basic Information</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Project Title</FormLabel>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    size="lg"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Project Description</FormLabel>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    size="lg"
                    minH="150px"
                  />
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          <Card w="100%">
            <CardHeader>
              <Heading size="md">Milestones</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={6}>
                {milestones.map((milestone, index) => (
                  <Box
                    key={milestone.id}
                    p={6}
                    borderWidth="1px"
                    borderRadius="lg"
                    borderColor="gray.200"
                    bg="white"
                    shadow="sm"
                    transition="all 0.2s"
                    _hover={{ shadow: "md" }}
                  >
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      <GridItem colSpan={2}>
                        <FormControl>
                          <FormLabel>Title</FormLabel>
                          <Input
                            value={milestone.title}
                            onChange={(e) =>
                              handleMilestoneChange(index, "title", e.target.value)
                            }
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem colSpan={2}>
                        <FormControl>
                          <FormLabel>Description</FormLabel>
                          <Textarea
                            value={milestone.description || ""}
                            onChange={(e) =>
                              handleMilestoneChange(index, "description", e.target.value)
                            }
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Status</FormLabel>
                          <Select
                            value={milestone.status}
                            onChange={(e) =>
                              handleMilestoneChange(index, "status", e.target.value)
                            }
                          >
                            {Object.values(ProjectMilestoneStatus).map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Due Date</FormLabel>
                          <Input
                            type="date"
                            value={new Date(milestone.dueDate).toISOString().split("T")[0]}
                            onChange={(e) =>
                              handleMilestoneChange(index, "dueDate", new Date(e.target.value))
                            }
                          />
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </Box>
                ))}
              </Stack>
            </CardBody>
          </Card>

          <Card w="100%">
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="md">Member Management</Heading>
                <Tooltip label="Register Selected Members">
                  <IconButton
                    aria-label="Register members"
                    icon={<FiUserPlus />}
                    onClick={handleRegister}
                    isDisabled={selectedMemberIds.length === 0}
                    colorScheme="blue"
                  />
                </Tooltip>
              </HStack>
            </CardHeader>
            <CardBody>
              <CheckboxGroup onChange={handleMemberSelect} value={selectedMemberIds}>
                <Stack spacing={3}>
                  {labMembers.map((member) => (
                    <Checkbox
                      key={member.id}
                      value={member.id}
                      isDisabled={registeredMembers.includes(member.id)}
                    >
                      <HStack>
                        <Avatar size="sm" name={member.username} />
                        <Text>{member.username}</Text>
                        {registeredMembers.includes(member.id) && (
                          <Badge colorScheme="green">Registered</Badge>
                        )}
                      </HStack>
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </CardBody>
          </Card>

          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            leftIcon={<FiSave />}
            w="full"
          >
            Save
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

export default ProjectEditForm;
