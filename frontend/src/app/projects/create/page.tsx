import { getServerSession } from "next-auth/next";
import { authOption } from "@/lib/next-auth/auth";
import { redirect } from "next/navigation";
import ProjectCreateForm from "./_components/ProjectCreateForm";
import { Box, Container } from "@chakra-ui/react";
import { getLabMenbers } from "./action";

const CreateProjectPage = async () => {
  const session = await getServerSession(authOption);

  if (!session) {
    redirect("/auth/signin");
  }

  const labId = session.user.labId || "";
  // ユーザーが学生の場合はプロジェクト一覧ページにリダイレクト
  if (session.user.role === "STUDENT") {
    redirect("/projects");
  }

  const response = await getLabMenbers(labId);
  const members = response.members;

  return (
    <Container>
      <ProjectCreateForm labId={labId} initialMembers={members} />
    </Container>
  );
};

export default CreateProjectPage;
