import React from "react";
import ProjectEditForm from "./_components/ProjectEditForm";

const ProjectPage = ({ params }: { params: { id: string } }) => {
  const { id: projectId } = params;

  return (
    <div>
      <h1>プロジェクト編集</h1>
      <ProjectEditForm projectId={projectId} />
    </div>
  );
};

export default ProjectPage;
