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
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import {
    getProject,
    updateProject,
    getLabMenbers,
    projectRegister,
  } from "../action";
  import {
    Project,
    ProjectMilestone,
    ProjectMilestoneStatus,
    Users,
  } from "@/types";

const ProjectEditForm = ({ projectId }: { projectId: string }) => {
  const { data: session, status } = useSession(); // セッションからユーザー情報を取得
  if (!session) redirect("/auth/signin");

  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [labMembers, setLabMembers] = useState<Users[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [registeredMembers, setRegisteredMembers] = useState<string[]>([]);

  useEffect(() => {
    const fetchProject = async () => {
      const projectData = await getProject(projectId);
      setProject(projectData.project);
      setTitle(projectData.project.title);
      setDescription(projectData.project.description || "");
      setMilestones(projectData.project.milestones);
      if (projectData.project.members) {
        setRegisteredMembers(
          projectData.project.members.map((m: any) => m.userId),
        );
      }
    };
    fetchProject();
    setIsLoading(false);
  }, [projectId]);

  useEffect(() => {
    (async () => {
      if (project && project.labId) {
        const { members } = await getLabMenbers(project.labId);
        setLabMembers(members);
      }
    })();
  }, [project]);

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
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMemberSelect = (values: string[]) => {
    setSelectedMemberIds(values);
  };

  if (!project) return <Box>Loading...</Box>;

  return (
    <form onSubmit={handleEditProject}>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>プロジェクトタイトル</FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>プロジェクト説明</FormLabel>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
                />
              </FormControl>
              <FormControl mt={2}>
                <FormLabel>説明</FormLabel>
                <Textarea
                  value={milestone.description || ""}
                  onChange={(e) =>
                    handleMilestoneChange(index, "description", e.target.value)
                  }
                />
              </FormControl>
              <FormControl mt={2}>
                <FormLabel>ステータス</FormLabel>
                <Select
                  value={milestone.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
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
                />
              </FormControl>
            </Box>
          ))}
        </Box>
        <FormControl width="100%">
          <FormLabel fontSize="lg">メンバーを選択</FormLabel>
          <Box border="1px" borderColor="gray.200" p={4} borderRadius="md">
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
          </Box>
        </FormControl>
        <Button
          mt={2}
          onClick={handleRegister}
          isDisabled={selectedMemberIds.length === 0}
          colorScheme="blue"
        >
          選択したメンバーを登録
        </Button>
        <Button type="submit" colorScheme="blue">
          更新
        </Button>
        {success && <Box color="green.500">{success}</Box>}
      </VStack>
    </form>
  );
};

export default ProjectEditForm;
