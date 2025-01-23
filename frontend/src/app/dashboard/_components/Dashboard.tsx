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
  Icon,
  HStack,
  VStack,
  Flex,
} from "@chakra-ui/react";
import { Meeting, Project, AvailableSlot, MeetingType } from "@/types";
import { getMeetings, getProjects, getAvailableSlots } from "../action";
import Pagination from "@/app/lab/_components/Pagination";
import { ITEM_LIMIT } from "@/const";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCalendar, FaClock, FaProjectDiagram, FaUsers } from "react-icons/fa";
import Link from "next/link";

interface DashboardProps {
  userId: string;
  initialMeetings: Meeting[];
  initialProjects: Project[];
  initialAvailableSlots: AvailableSlot[];
  initialTabIndex?: number;
  initialTotalCount: number;
}
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
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.600");

  const handleTabChange = (index: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", index.toString());
    router.push(`?${params.toString()}`);
  };

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
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [userId, offset]);

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

  useEffect(() => {
    const offsetParam = searchParams.get("offset");
    if (offsetParam && Number(offsetParam) !== offset) {
      setOffset(Number(offsetParam));
    }
  }, [searchParams]);

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>
            Dashboard
          </Heading>
          <Text color="gray.500">
            Manage your meetings, available slots, and projects
          </Text>
        </Box>

        <Tabs
          colorScheme="blue"
          variant="enclosed"
          index={tabIndex}
          onChange={handleTabChange}
          isLazy
        >
          <TabList>
            <Tab>
              <HStack>
                <Icon as={FaCalendar} />
                <Text>Meetings</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack>
                <Icon as={FaClock} />
                <Text>Available Slots</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack>
                <Icon as={FaProjectDiagram} />
                <Text>Projects</Text>
              </HStack>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {meetings.map((meeting) => (
                  <Link
                    key={meeting.id}
                    href={`/meetings/${meeting.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Card
                      bg={bgColor}
                      borderWidth="1px"
                      borderColor={borderColor}
                      borderRadius="lg"
                      overflow="hidden"
                      transition="all 0.2s"
                      _hover={{
                        transform: "translateY(-2px)",
                        shadow: "md",
                        cursor: "pointer",
                      }}
                    >
                      <CardHeader pb={2}>
                        <HStack justify="space-between" align="start">
                          <Heading size="md" noOfLines={2}>
                            {meeting.title}
                          </Heading>
                          <Badge
                            colorScheme={
                              meeting.type === MeetingType.REGULAR
                                ? "green"
                                : "purple"
                            }
                            borderRadius="full"
                            px={2}
                          >
                            {meeting.type === MeetingType.REGULAR
                              ? "Regular"
                              : "Irregular"}
                          </Badge>
                        </HStack>
                      </CardHeader>
                      <CardBody pt={2}>
                        <VStack spacing={3} align="stretch">
                          <HStack>
                            <Icon as={FaClock} color="blue.500" />
                            <Text fontSize="sm">
                              {new Date(meeting.startTime).toLocaleString(
                                "ja-JP",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                              {" - "}
                              {new Date(meeting.endTime).toLocaleString(
                                "ja-JP",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </Text>
                          </HStack>
                          {meeting.description && (
                            <Text fontSize="sm" color="gray.500" noOfLines={2}>
                              {meeting.description}
                            </Text>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </SimpleGrid>
            </TabPanel>

            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {availableSlots.map((slot) => (
                  <Link
                    key={slot.id}
                    href={`/meetings/availableslots`}
                    style={{ textDecoration: "none" }}
                  >
                    <Card
                      bg={bgColor}
                      borderWidth="1px"
                      borderColor={borderColor}
                      borderRadius="lg"
                      overflow="hidden"
                      transition="all 0.2s"
                      _hover={{
                        transform: "translateY(-2px)",
                        shadow: "md",
                        cursor: "pointer",
                      }}
                    >
                      <CardHeader pb={2}>
                        <Heading size="md">Available Slot</Heading>
                      </CardHeader>
                      <CardBody pt={2}>
                        <VStack spacing={3} align="stretch">
                          <HStack>
                            <Icon as={FaCalendar} color="blue.500" />
                            <Text fontSize="sm">
                              {new Date(slot.startTime).toLocaleString(
                                "ja-JP",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                },
                              )}
                              ({dayOfWeek[slot.dayOfWeek]})
                            </Text>
                          </HStack>
                          <HStack>
                            <Icon as={FaClock} color="blue.500" />
                            <Text fontSize="sm">
                              {new Date(slot.startTime).toLocaleString(
                                "ja-JP",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                              {" - "}
                              {new Date(slot.endTime).toLocaleString("ja-JP", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Text>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </SimpleGrid>
              <Box mt={6}>
                <Pagination
                  keyword=""
                  offset={offset}
                  totalCount={totalCount}
                  currentTab={tabIndex}
                />
              </Box>
            </TabPanel>

            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Card
                      bg={bgColor}
                      borderWidth="1px"
                      borderColor={borderColor}
                      borderRadius="lg"
                      overflow="hidden"
                      transition="all 0.2s"
                      _hover={{
                        transform: "translateY(-2px)",
                        shadow: "md",
                        cursor: "pointer",
                      }}
                    >
                      <CardHeader pb={2}>
                        <Heading size="md" noOfLines={2}>
                          {project.title}
                        </Heading>
                      </CardHeader>
                      <CardBody pt={2}>
                        <VStack spacing={3} align="stretch">
                          {project.description && (
                            <Text fontSize="sm" color="gray.500" noOfLines={2}>
                              {project.description}
                            </Text>
                          )}
                          <HStack>
                            <Icon as={FaUsers} color="blue.500" />
                            <Text fontSize="sm">
                              Members: {project.members.length}
                            </Text>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
}
