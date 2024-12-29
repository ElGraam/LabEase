'use client';
import { useState, useEffect } from "react";
import { Button, FormControl, FormLabel, Input, Textarea, VStack, Box, Select } from "@chakra-ui/react";
import { Project, ProjectMilestone, ProjectMilestoneStatus } from "@/types";
import { getProject, updateProject } from "../action";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

const ProjectEditForm = ({ projectId }: { projectId: string }) => {
    const { data: session, status } = useSession(); // セッションからユーザー情報を取得
    if (!session) redirect('/auth/signin');

    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            const projectData = await getProject(projectId);
            setProject(projectData.project);
            setTitle(projectData.project.title);
            setDescription(projectData.project.description || "");
            setMilestones(projectData.project.milestones);
        };
        fetchProject();
        setIsLoading(false);
    }, [projectId]);

    const handleMilestoneChange = (index: number, field: keyof ProjectMilestone, value: any) => {
        const updatedMilestones = [...milestones];
        updatedMilestones[index] = {
            ...updatedMilestones[index],
            [field]: value
        };
        setMilestones(updatedMilestones);
    };

    const handleEditProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formattedMilestones = milestones.map(milestone => ({
                title: milestone.title,
                description: milestone.description || '',
                status: milestone.status,
                dueDate: milestone.dueDate
            }));
            if (session?.user?.role != 'STUDENT') {
                await updateProject(title, description, formattedMilestones, projectId);
                setSuccess("更新しました");
            }

        } catch (error) {
            console.error(error);
        }
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
                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </FormControl>

                <Box w="100%">
                    <h2>マイルストーン</h2>
                    {milestones.map((milestone, index) => (
                        <Box key={milestone.id} p={4} border="1px" borderColor="gray.200" mt={2}>
                            <FormControl>
                                <FormLabel>タイトル</FormLabel>
                                <Input
                                    value={milestone.title}
                                    onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                                />
                            </FormControl>
                            <FormControl mt={2}>
                                <FormLabel>説明</FormLabel>
                                <Textarea
                                    value={milestone.description || ''}
                                    onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                                />
                            </FormControl>
                            <FormControl mt={2}>
                                <FormLabel>ステータス</FormLabel>
                                <Select
                                    value={milestone.status}
                                    onChange={(e) => handleMilestoneChange(index, 'status', e.target.value)}
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
                                    value={new Date(milestone.dueDate).toISOString().split('T')[0]}
                                    onChange={(e) => handleMilestoneChange(index, 'dueDate', new Date(e.target.value))}
                                />
                            </FormControl>
                        </Box>
                    ))}
                </Box>
                <Button type="submit" colorScheme="blue">更新</Button>
                {success && <Box color="green.500">{success}</Box>}
            </VStack>
        </form>
    );
};

export default ProjectEditForm;