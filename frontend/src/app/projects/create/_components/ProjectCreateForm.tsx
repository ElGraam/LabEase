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
} from "@chakra-ui/react";
import { Project } from "@/types";
import { projectCreate } from "../action";
import { useRouter } from "next/navigation";

type CreateMilestone = {
  title: string;
  description: string;
  dueDate: Date;
};

type ProjectCreateFormProps = {
  labId: string;
};

const ProjectCreateForm: React.FC<ProjectCreateFormProps> = ({
  labId,
}): JSX.Element => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneDescription, setMilestoneDescription] = useState("");
  const [milestoneDueDate, setMilestoneDueDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const milestones: CreateMilestone[] = [
      {
        title: milestoneTitle,
        description: milestoneDescription,
        dueDate: new Date(milestoneDueDate),
      },
    ];

    try {
      await projectCreate(title, description, labId, milestones);
      router.push("/projects");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>
        新しいプロジェクトを作成
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>タイトル</FormLabel>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>説明</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>マイルストーンのタイトル</FormLabel>
            <Input
              type="text"
              value={milestoneTitle}
              onChange={(e) => setMilestoneTitle(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>マイルストーンの説明</FormLabel>
            <Textarea
              value={milestoneDescription}
              onChange={(e) => setMilestoneDescription(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>マイルストーンの期限</FormLabel>
            <Input
              type="date"
              value={milestoneDueDate}
              onChange={(e) => setMilestoneDueDate(e.target.value)}
            />
          </FormControl>
          {/* labId は hidden フィールドとして送信 */}
          <input type="hidden" name="labId" value={labId} />
          <Button type="submit" colorScheme="blue" isLoading={isLoading}>
            作成
          </Button>
          {error && <Box color="red.500">{error}</Box>}
        </VStack>
      </form>
    </Box>
  );
};

export default ProjectCreateForm;
