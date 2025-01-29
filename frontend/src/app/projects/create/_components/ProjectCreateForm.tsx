"use client";

import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  HStack,
  Text,
  Avatar,
  Stack,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { Users } from "@/types";
import { projectCreate } from "../action";
import { useRouter } from "next/navigation";
import { FiUserMinus } from "react-icons/fi";

type CreateMilestone = {
  title: string;
  description: string;
  dueDate: Date;
};

type ProjectCreateFormProps = {
  labId: string;
  initialMembers: Users[];
};

const ProjectCreateForm: React.FC<ProjectCreateFormProps> = ({
  labId,
  initialMembers,
}): JSX.Element => {
  const router = useRouter();
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneDescription, setMilestoneDescription] = useState("");
  const [milestoneDueDate, setMilestoneDueDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [members] = useState<Users[]>(initialMembers);
  const [selectedMembers, setSelectedMembers] = useState<Users[]>([]);
  const [milestoneDateError, setMilestoneDateError] = useState<string | null>(
    null,
  );

  const validateDueDate = (date: string) => {
    const selectedDate = new Date(date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (selectedDate < tomorrow) {
      setMilestoneDateError("Due date must be set to tomorrow or later");
      return false;
    }
    setMilestoneDateError(null);
    return true;
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setMilestoneDueDate(newDate);
    validateDueDate(newDate);
    setError(null); // Clear error message in real-time
  };

  const handleMemberSelect = (memberId: string) => {
    const selectedMember = members.find((member) => member.id === memberId);
    if (selectedMember && !selectedMembers.some((m) => m.id === memberId)) {
      setSelectedMembers([...selectedMembers, selectedMember]);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setSelectedMembers(
      selectedMembers.filter((member) => member.id !== memberId),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMembers.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one member",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!validateDueDate(milestoneDueDate)) {
      toast({
        title: "Error",
        description: "Milestone due date must be a future date",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const milestonedate = new Date(milestoneDueDate).getDay();
    if (milestonedate === 0 || milestonedate === 6) {
      toast({
        title: "Invalid date",
        description: "Weekends (Saturday and Sunday) cannot be selected.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsLoading(true);
    const milestones: CreateMilestone[] = [
      {
        title: milestoneTitle,
        description: milestoneDescription,
        dueDate: new Date(milestoneDueDate),
      },
    ];

    try {
      await projectCreate(
        title,
        description,
        labId,
        milestones,
        selectedMembers.map((member) => member.id),
      );
      router.push("/projects");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>
        Create New Project
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Members</FormLabel>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Selected Members
              </Text>
              <Stack spacing={3}>
                {selectedMembers.map((member) => (
                  <HStack
                    key={member.id}
                    justify="space-between"
                    p={2}
                    borderWidth="1px"
                    borderRadius="md"
                  >
                    <HStack>
                      <Avatar size="sm" name={member.username} />
                      <Text>{member.username}</Text>
                    </HStack>
                    <IconButton
                      aria-label="Remove member"
                      icon={<FiUserMinus />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleRemoveMember(member.id)}
                    />
                  </HStack>
                ))}
              </Stack>
            </Box>
            <Box mt={4}>
              <Text fontWeight="bold" mb={2}>
                Available Members
              </Text>
              <Stack spacing={3}>
                {members
                  .filter(
                    (member) =>
                      !selectedMembers.some((m) => m.id === member.id),
                  )
                  .map((member) => (
                    <HStack
                      key={member.id}
                      justify="space-between"
                      p={2}
                      borderWidth="1px"
                      borderRadius="md"
                      cursor="pointer"
                      onClick={() => handleMemberSelect(member.id)}
                      _hover={{ bg: "gray.50" }}
                    >
                      <HStack>
                        <Avatar size="sm" name={member.username} />
                        <Text>{member.username}</Text>
                      </HStack>
                    </HStack>
                  ))}
              </Stack>
            </Box>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Milestone Title</FormLabel>
            <Input
              type="text"
              value={milestoneTitle}
              onChange={(e) => setMilestoneTitle(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Milestone Description</FormLabel>
            <Textarea
              value={milestoneDescription}
              onChange={(e) => setMilestoneDescription(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired isInvalid={!!milestoneDateError}>
            <FormLabel>Milestone Due Date</FormLabel>
            <Input
              type="date"
              value={milestoneDueDate}
              onChange={handleDueDateChange}
            />
            {milestoneDateError && (
              <Box color="red.500" fontSize="sm" mt={1}>
                {milestoneDateError}
              </Box>
            )}
          </FormControl>
          <input type="hidden" name="labId" value={labId} />
          <Button type="submit" colorScheme="blue" isLoading={isLoading}>
            Create
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ProjectCreateForm;
