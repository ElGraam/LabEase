import { getMeeting } from "./action";
import { MeetingDetailView } from "./_components/MeeingDetailView";
import { Box, Spinner, Center } from "@chakra-ui/react";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/next-auth/auth";
import { redirect } from "next/navigation";

interface MeetingPageProps {
  params: {
    id: string;
  };
}

export default async function MeetingPage({ params }: MeetingPageProps) {
  const { meetings: meeting } = await getMeeting(params.id);
  const session = await getServerSession(authOption);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }
  if (!meeting) {
    return (
      <Center h="100vh">
        <Box>Meeting not found.</Box>
      </Center>
    );
  }

  return (
    <Suspense
      fallback={
        <Center h="100vh">
          <Spinner size="xl" thickness="4px" color="blue.500" />
        </Center>
      }
    >
      <Box py={4} maxW="container.xl" mx="auto">
        <MeetingDetailView meeting={meeting} />
      </Box>
    </Suspense>
  );
}
