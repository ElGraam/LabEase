import { getServerSession } from "next-auth";
import { authOption } from "@/lib/next-auth/auth";
import { redirect } from "next/navigation";
import { Container, Box, Center } from "@chakra-ui/react";
import { getMeetings, getProjects, getAvailableSlots } from "./action";
import { ITEM_LIMIT } from "@/const";
import Dashboard from "./_components/Dashboard";

type Props = {
  searchParams: {
    tab?: string;
    offset?: string;
  };
};

export default async function DashboardPage({ searchParams }: Props) {
  const session = await getServerSession(authOption);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    const offset = searchParams.offset ? parseInt(searchParams.offset) : 0;
    const tabIndex = searchParams.tab ? parseInt(searchParams.tab) : 0;

    const [meetingsData, projectsData, slotsData] = await Promise.all([
      getMeetings(session.user.id),
      getProjects(session.user.id),
      getAvailableSlots(session.user.id, offset, ITEM_LIMIT),
    ]);

    return (
      <div>
        <Dashboard
          userId={session.user.id}
          initialMeetings={meetingsData.meetings}
          initialProjects={projectsData.projects}
          initialAvailableSlots={slotsData.availableSlots}
          initialTabIndex={tabIndex}
          initialTotalCount={slotsData.totalCount}
        />
      </div>
    );
  } catch (error) {
    return (
      <Center h="100vh">
        <Box>An error occurred. Please try again later.</Box>
      </Center>
    );
  }
}
