import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOption } from "@/lib/next-auth/auth";
import { Box, Center } from "@chakra-ui/react";
import { getLab } from "./action";
import { LabDetailPage } from "./_components/LabDetailPage";

const LabPage = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOption);

  if (!session) {
    redirect("/auth/signin");
  }
  const labId = session.user.labId;
  if (labId !== params.id) {
    redirect("/dashboard");
  }
  try {
    const res = await getLab(params.id);
    const { lab, professor, status } = res;

    if (status !== 200) {
      return (
        <Center h="100vh">
          <Box>Failed to retrieve laboratory information.</Box>
        </Center>
      );
    }

    return (
      <div>
        <LabDetailPage lab={lab} professor={professor} />
      </div>
    );
  } catch (error) {
    return (
      <Center h="100vh">
        <Box>An error occurred. Please try again later.</Box>
      </Center>
    );
  }
};

export default LabPage;
