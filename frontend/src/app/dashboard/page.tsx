import Dashboard from "./_components/Dashboard";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/next-auth/auth";
import { redirect } from "next/navigation";
import { getMeetings, getProjects, getAvailableSlots } from "./action";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOption);
  if (!session) {
    redirect("/auth/signin");
  }
  const userId = session.user?.id;
  if (!userId) {
    redirect("/auth/signin");
  }

  const offset =
    typeof searchParams.offset === "string" ? parseInt(searchParams.offset) : 0;
  const tabIndex =
    typeof searchParams.tab === "string" ? parseInt(searchParams.tab) : 0;

  const [meetingsData, projectsData, slotsData] = await Promise.all([
    getMeetings(userId),
    getProjects(userId),
    getAvailableSlots(userId, offset, 10),
  ]);

  return (
    <Dashboard
      userId={userId}
      initialMeetings={meetingsData.meetings}
      initialProjects={projectsData.projects}
      initialAvailableSlots={slotsData.availableSlots}
      initialTabIndex={tabIndex}
      initialTotalCount={slotsData.totalCount}
    />
  );
}
