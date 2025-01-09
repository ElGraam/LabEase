import { getMeetings } from "./action";
import MeetingList from "./_components/meetingList";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOption } from "@/lib/next-auth/auth";
import { Box, Heading } from "@chakra-ui/react";
const MeetingPage = async () => {
  const session = await getServerSession(authOption);
  if (!session) {
    redirect("/auth/signin");
  }
  try {

    const userId = session.user.id;
    const { meetings } = await getMeetings(userId);

    return (
    <Box maxW="container.xl" mx="auto" p={4}>
      <Heading as="h1" size="xl" mb={4}>Meeting List</Heading>
      <MeetingList meetings={meetings} />
    </Box>
    );
  } catch (error) {
    return (
    <Box maxW="container.xl" mx="auto" p={4}>
      <Heading as="h1" size="xl" mb={4}>Meeting List</Heading>
      <Box textAlign="center" py={4} color="red.500">
        An error occurred. Please try again later.
      </Box>
    </Box>
    );
  }
}

export default MeetingPage;