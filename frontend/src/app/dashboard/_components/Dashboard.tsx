"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Text,
  Stack,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
} from "@chakra-ui/react";
import { Meeting, Project, AvailableSlot, MeetingType } from "@/types";
import { getMeetings, getProjects, getAvailableSlots } from "../action";
import Pagination from "@/app/lab/_components/Pagination";
import { ITEM_LIMIT } from "@/const";
import { useRouter, useSearchParams } from "next/navigation";

interface DashboardProps {
  userId: string;
  initialMeetings: Meeting[];
  initialProjects: Project[];
  initialAvailableSlots: AvailableSlot[];
  initialTabIndex?: number;
  initialTotalCount: number;
}
// 曜日を英語で表示
const dayOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function Dashboard({
  userId,
  initialMeetings,
  initialProjects,
  initialAvailableSlots,
  initialTabIndex = 0,
  initialTotalCount,
}: DashboardProps) {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>(
    initialAvailableSlots,
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabIndex = Number(searchParams.get("tab") || initialTabIndex);
  const initialOffset = Number(searchParams.get("offset") || 0);
  const [offset, setOffset] = useState<number>(initialOffset);
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount);
  const bgColor = useColorModeValue("white", "gray.700");

  const handleTabChange = (index: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", index.toString());
    router.push(`?${params.toString()}`);
  };

  // 必要に応じて更新するための useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meetingsData, projectsData, slotsData] = await Promise.all([
          getMeetings(userId),
          getProjects(userId),
          getAvailableSlots(userId, offset, ITEM_LIMIT),
        ]);
        setMeetings(meetingsData.meetings);
        setProjects(projectsData.projects);
        setAvailableSlots(slotsData.availableSlots);
        setTotalCount(slotsData.totalCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // インターバルを設定
    const interval = setInterval(fetchData, 60000); // 1分ごとに更新

    return () => clearInterval(interval);
  }, [userId, offset]);

  // offsetが変更されたときにURLを更新
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (offset !== initialOffset) {
      params.set("offset", offset.toString());
      if (!params.has("tab")) {
        params.set("tab", tabIndex.toString());
      }
      router.push(`?${params.toString()}`);
    }
  }, [offset, initialOffset, tabIndex, searchParams, router]);

  // URLのoffsetパラメータが変更されたときにoffsetを更新
  useEffect(() => {
    const offsetParam = searchParams.get("offset");
    if (offsetParam && Number(offsetParam) !== offset) {
      setOffset(Number(offsetParam));
    }
  }, [searchParams]);

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6}>Dashboard</Heading>
      <Tabs
        colorScheme="blue"
        variant="enclosed"
        index={tabIndex}
        onChange={handleTabChange}
      >
        <TabList>
          <Tab>Meetings</Tab>
          <Tab>Available Slots</Tab>
          <Tab>Projects</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {meetings.map((meeting) => (
                <Card key={meeting.id} bg={bgColor} shadow="md">
                  <CardHeader>
                    <Heading size="md">{meeting.title}</Heading>
                  </CardHeader>
                  <CardBody>
                    <Stack spacing={3}>
                      <Text>
                        Start:{" "}
                        {new Date(meeting.startTime).toLocaleString("ja-JP", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                      <Text>
                        End:{" "}
                        {new Date(meeting.endTime).toLocaleString("ja-JP", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                      <Text>
                        Type:{" "}
                        {meeting.type === MeetingType.REGULAR
                          ? "Regular"
                          : "Irregular"}
                      </Text>
                      {meeting.description && (
                        <Text>Details: {meeting.description}</Text>
                      )}
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </TabPanel>

          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {availableSlots.map((slot) => (
                <Card key={slot.id} bg={bgColor} shadow="md">
                  <CardHeader>
                    <Heading size="md">Available Slot</Heading>
                  </CardHeader>
                  <CardBody>
                    <Stack spacing={3}>
                      <Text>Day: {dayOfWeek[slot.dayOfWeek]}</Text>
                      <Text>
                        Start:{" "}
                        {new Date(slot.startTime).toLocaleString("ja-JP", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                      <Text>
                        End:{" "}
                        {new Date(slot.endTime).toLocaleString("ja-JP", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
            <Pagination
              keyword=""
              offset={offset}
              totalCount={totalCount}
              currentTab={tabIndex}
            />
          </TabPanel>

          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {projects.map((project) => (
                <Card key={project.id} bg={bgColor} shadow="md">
                  <CardHeader>
                    <Heading size="md">{project.title}</Heading>
                  </CardHeader>
                  <CardBody>
                    <Stack spacing={3}>
                      {project.description && (
                        <Text>Details: {project.description}</Text>
                      )}
                      <Text>Laboratory: {project.lab.name}</Text>
                      <Text>Members: {project.members.length}</Text>
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
