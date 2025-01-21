"use client";

import { Meeting, MeetingType } from "@/types";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Divider,
  Icon,
  Button,
  useToast,
} from "@chakra-ui/react";
import {
  FaClock,
  FaUsers,
  FaInfoCircle,
  FaArrowLeft,
  FaTrash,
} from "react-icons/fa";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { deleteMeetingMember } from "../action";
import { useRouter } from "next/navigation";

interface MeetingDetailViewProps {
  meeting: Meeting;
}

export const MeetingDetailView = ({ meeting }: MeetingDetailViewProps) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const toast = useToast();
  const router = useRouter();

  const handleLeaveMeeting = async () => {
    if (!userId || !meeting.id) return;
    try {
      await deleteMeetingMember(meeting.id, userId);
      toast({
        title: "Left the meeting",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.lg" py={8}>
      <Box mb={6}>
        <Button
          as={Link}
          href="/meetings"
          leftIcon={<FaArrowLeft />}
          colorScheme="gray"
          variant="ghost"
          size="sm"
        >
          Back to meetings list
        </Button>
      </Box>

      <Card
        bg="white"
        shadow="xl"
        borderRadius="xl"
        borderWidth="1px"
        borderColor="gray.200"
        _dark={{
          bg: "gray.800",
          borderColor: "gray.700",
        }}
      >
        <CardHeader>
          <VStack align="start" spacing={4}>
            <HStack spacing={4} width="full" justify="space-between">
              <VStack align="start" spacing={2}>
                <Badge
                  colorScheme={
                    meeting.type === MeetingType.REGULAR ? "green" : "purple"
                  }
                  fontSize="sm"
                  px={3}
                  py={1}
                  rounded="full"
                >
                  {meeting.type}
                </Badge>
                <Heading size="lg">{meeting.title}</Heading>
              </VStack>
            </HStack>

            <HStack spacing={6}>
              <HStack>
                <Icon as={FaClock} color="blue.500" boxSize={5} />
                <Text
                  fontSize="md"
                  color="gray.600"
                  _dark={{ color: "gray.300" }}
                >
                  {new Date(meeting.startTime).toLocaleString("ja-JP", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Tokyo",
                  })}{" "}
                  -
                  {new Date(meeting.endTime).toLocaleString("ja-JP", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Tokyo",
                  })}
                </Text>
              </HStack>
              <HStack>
                <Icon as={FaUsers} color="blue.500" boxSize={5} />
                <Text
                  fontSize="md"
                  color="gray.600"
                  _dark={{ color: "gray.300" }}
                >
                  {meeting.participants?.length || 0} Participants
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </CardHeader>

        <CardBody>
          <VStack align="start" spacing={8}>
            {meeting.description && (
              <Box
                w="full"
                bg="gray.50"
                p={6}
                borderRadius="lg"
                _dark={{ bg: "gray.700" }}
              >
                <HStack mb={3}>
                  <Icon as={FaInfoCircle} color="blue.500" boxSize={5} />
                  <Text fontSize="lg" fontWeight="bold">
                    Description
                  </Text>
                </HStack>
                <Text color="gray.600" _dark={{ color: "gray.300" }}>
                  {meeting.description}
                </Text>
              </Box>
            )}

            <Divider />

            <Box w="full">
              <HStack mb={4}>
                <Icon as={FaUsers} color="blue.500" boxSize={5} />
                <Text fontSize="lg" fontWeight="bold">
                  Participants List
                </Text>
              </HStack>
              <VStack align="start" spacing={4}>
                {meeting.participants?.map((participant) => (
                  <Box
                    key={participant.id}
                    w="full"
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    _hover={{ bg: "gray.50" }}
                    _dark={{
                      _hover: { bg: "gray.700" },
                      borderColor: "gray.600",
                    }}
                  >
                    <HStack spacing={4}>
                      <Avatar
                        size="md"
                        name={participant.user.username}
                        bg="blue.500"
                      />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold">
                          {participant.user.username}
                        </Text>
                        <Text
                          fontSize="sm"
                          color="gray.500"
                          _dark={{ color: "gray.400" }}
                        >
                          {participant.user.email}
                        </Text>
                      </VStack>
                      {userId === participant.user.id && (
                        <Button
                          ml="auto"
                          colorScheme="red"
                          size="sm"
                          leftIcon={<FaTrash />}
                          onClick={handleLeaveMeeting}
                        >
                          Leave
                        </Button>
                      )}
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
};
