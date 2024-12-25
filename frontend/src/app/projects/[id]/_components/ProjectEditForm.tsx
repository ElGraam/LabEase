'use client';
import { useState , useEffect} from "react";
import { Button, FormControl, FormLabel, Input, Textarea, VStack, Box } from "@chakra-ui/react";
import { Project } from "@/types";
import { getProject } from "../action";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

const ProjectEditForm = ({ projectId }: { projectId: string }) => {
    const { data: session, status } = useSession(); // セッションからユーザー情報を取得
    if (!session) redirect('/auth/signin');

    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);



    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            const projectData = await getProject(projectId);
            setProject(projectData.project);
        };
        fetchProject();
    }, [projectId]);
    
    const handleEditProject = async (e: React.FormEvent) => {
        e.preventDefault();
    };
    if (isLoading || !project) {
        return <Box>Loading...</Box>;
    }
    
    return (
        <div>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
          <p>研究室ID: {project.labId}</p>

          <h2>マイルストーン</h2>
          <ul>
            {project.milestones.map((milestone) => (
              <li key={milestone.id}>
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
                <p>{milestone.status}</p>
                <p>期限: {new Date(milestone.dueDate).toLocaleString()}</p>
                <p>ステータス: {milestone.status}</p>
                <p>完成日: {milestone.completionDate ? new Date(milestone.completionDate).toLocaleString() : null}</p>
              </li>
            ))}
          </ul>
          <h2>メンバー</h2>
          {project.members.map((member) => (
            <p key={member.id}>{member.user.username}</p>
            ))}
        </div>
      );
    };
export default ProjectEditForm;