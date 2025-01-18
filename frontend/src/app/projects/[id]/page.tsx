import React from "react";
import ProjectEditForm from "./_components/ProjectEditForm";
import { getProject, getLabMenbers } from "./action";

const ProjectPage = async ({ params }: { params: { id: string } }) => {
  const { id: projectId } = params;
  const projectData = await getProject(projectId);
  const { members } = await getLabMenbers(projectData.project.labId);

  return (
    <div>
      <h1>プロジェクト編集</h1>
      <ProjectEditForm 
        projectId={projectId}
        projectData={projectData.project}
        labMembers={members}
      />
    </div>
  );
};

export default ProjectPage;
