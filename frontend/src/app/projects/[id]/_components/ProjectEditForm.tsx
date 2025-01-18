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
} from "@chakra-ui/react";
import { redirect, useRouter } from "next/navigation";

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
        setSuccess("更新しました");
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
        setSuccess("メンバーを登録しました");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMemberSelect = (values: string[]) => {
    setSelectedMemberIds(values);
    
  };

  if (!projectData) return <Box>Loading...</Box>;

  return (
    <form onSubmit={handleEditProject}>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>プロジェクトタイトル</FormLabel>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            readOnly={session?.user?.role === "STUDENT"}
          />
        </FormControl>
        <FormControl>
          <FormLabel>プロジェクト説明</FormLabel>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            readOnly={session?.user?.role === "STUDENT"}
          />
        </FormControl>

        <Box w="100%">
          <h2>マイルストーン</h2>
          {milestones.map((milestone, index) => (
            <Box
              key={milestone.id}
              p={4}
              border="1px"
              borderColor="gray.200"
              mt={2}
            >
              <FormControl>
                <FormLabel>タイトル</FormLabel>
                <Input
                  value={milestone.title}
                  onChange={(e) =>
                    handleMilestoneChange(index, "title", e.target.value)
                  }
                  readOnly={session?.user?.role === "STUDENT"}
                />
              </FormControl>
              <FormControl mt={2}>
                <FormLabel>説明</FormLabel>
                <Textarea
                  value={milestone.description || ""}
                  onChange={(e) =>
                    handleMilestoneChange(index, "description", e.target.value)
                  }
                  readOnly={session?.user?.role === "STUDENT"}
                />
              </FormControl>
              <FormControl mt={2}>
                <FormLabel>ステータス</FormLabel>
                <Select
                  value={milestone.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleMilestoneChange(index, "status", e.target.value)
                  }
                  isDisabled={session?.user?.role === "STUDENT"}
                  sx={{
                    color: session?.user?.role === "STUDENT" ? "black" : undefined,
                    opacity: "1 !important",
                    bg: session?.user?.role === "STUDENT" ? "gray.50" : undefined
                  }}
                >
                  {Object.values(ProjectMilestoneStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl mt={2}>
                <FormLabel>期限</FormLabel>
                <Input
                  type="date"
                  value={
                    new Date(milestone.dueDate).toISOString().split("T")[0]
                  }
                  onChange={(e) =>
                    handleMilestoneChange(
                      index,
                      "dueDate",
                      new Date(e.target.value),
                    )
                  }
                  isReadOnly={session?.user?.role === "STUDENT"}
                />
              </FormControl>
            </Box>
          ))}
        </Box>
        <FormControl width="100%">
          <FormLabel fontSize="lg">
            {session?.user?.role === "STUDENT" ? "メンバー" : "メンバーを選択"}
          </FormLabel>
          <Box border="1px" borderColor="gray.200" p={4} borderRadius="md">
            {session?.user?.role === "STUDENT" ? (
              <Stack spacing={2}>
                {labMembers
                  .filter(member => registeredMembers.includes(member.id))
                  .map((member) => (
                    <Box key={member.id} p={1}>
                      {member.username}
                    </Box>
                  ))}
              </Stack>
            ) : (
              <CheckboxGroup
                onChange={handleMemberSelect}
                value={selectedMemberIds}
              >
                <Stack spacing={2}>
                  {labMembers.map((member) => (
                    <Checkbox
                      key={member.id}
                      value={member.id}
                      isDisabled={registeredMembers.includes(member.id)}
                    >
                      {member.username}{" "}
                      {registeredMembers.includes(member.id) && "(登録済み)"}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            )}
          </Box>
        </FormControl>
        {session?.user?.role !== "STUDENT" && (
          <>
            <Button
              mt={2}
              onClick={handleRegister}
              isDisabled={selectedMemberIds.length === 0}
              colorScheme="blue"
            >
              選択したメンバーを登録
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
            >
              更新
            </Button>
          </>
        )}
        {success && <Box color="green.500">{success}</Box>}
      </VStack>
    </form>
  );
};

export default ProjectEditForm;
