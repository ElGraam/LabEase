import ProjectDetailView from "./_components/ProjectDetailView";
import { getProject, getLabMenbers } from "./action";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/next-auth/auth";
import { redirect } from "next/navigation";

const ProjectPage = async ({ params }: { params: { id: string } }) => {
  const { id: projectId } = params;
  const session = await getServerSession(authOption);
  if (!session) {
    return redirect("/auth/signin");
  }
  const projectData = await getProject(projectId);
  const { members } = await getLabMenbers(session.user.labId);

  return (
    <div>
      <ProjectDetailView
        projectId={projectId}
        projectData={projectData.project}
        labMembers={members}
      />
    </div>
  );
};

export default ProjectPage;
