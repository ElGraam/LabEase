import React from "react";
import ProjectEditForm from "../_components/ProjectEditForm";
import { getProject, getLabMenbers } from "./action";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/next-auth/auth";
import { redirect } from "next/navigation";

const ProjectEditPage = async ({ params }: { params: { id: string } }) => {
  const { id: projectId } = params;
  const session = await getServerSession(authOption);
  if (!session) {
    return redirect("/auth/signin");
  }
  if (session.user.role === "STUDENT") {
    return redirect(`/projects/${projectId}`);
  }
  const projectData = await getProject(projectId);
  const { members } = await getLabMenbers(session.user.labId);

  return (
    <div>
      <ProjectEditForm
        projectId={projectId}
        projectData={projectData.project}
        labMembers={members}
      />
    </div>
  );
};

export default ProjectEditPage;
