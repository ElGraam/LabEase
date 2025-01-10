"use client";

import { Meeting, Role } from "@/types";
import { deleteMeeting } from "../action";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Spinner,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  IconButton
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useSession } from "next-auth/react";

type Props = {
  meetings: Meeting[];
};

export default function MeetingList({ meetings: initialMeetings }: Props) {
  const [meetings, setMeetings] = useState(initialMeetings);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [targetMeetingId, setTargetMeetingId] = useState<string>("");
  const toast = useToast();
  const { data: session } = useSession();
  const role = session?.user?.role;

  const canDelete = role === Role.PROFESSOR || role === Role.SUB_INSTRUCTOR;

  const handleDeleteClick = (meetingId: string) => {
    setTargetMeetingId(meetingId);
    onOpen();
  };

  const handleDelete = async () => {
    try {
      await deleteMeeting(targetMeetingId);
      setMeetings(meetings.filter(meeting => meeting.id !== targetMeetingId));
      toast({
        title: "Meeting deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to delete.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  if (!meetings || !Array.isArray(meetings)) {
    return (
      <Box textAlign="center" py={4}>
        <Spinner />
        <Alert status="error" mt={4}>
          <AlertIcon />
          Failed to load meeting data.
        </Alert>
      </Box>
    );
  }

  if (meetings.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Alert status="info">
          <AlertIcon />
          There are no scheduled meetings.
        </Alert>
      </Box>
    );
  }

  return (
    <>
      <Box display="flex" flexDirection="column" gap={4}>
        {meetings.map((meeting) => (
          <Box
            key={meeting.id}
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            shadow="sm"
            _hover={{ shadow: "md" }}
            transition="box-shadow 0.2s"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Box>
                <Box as="h2" fontSize="xl" fontWeight="semibold">
                  {meeting.title}
                </Box>
                <Box color="gray.600">{meeting.description}</Box>
              </Box>
              <Box display="flex" gap={2} alignItems="center">
                <Box
                  bg="blue.100"
                  color="blue.800"
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontSize="sm"
                >
                  {meeting.type}
                </Box>
                {canDelete && (
                  <IconButton
                    aria-label="Delete meeting"
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => handleDeleteClick(meeting.id)}
                  />
                )}
              </Box>
            </Box>
            <Box mt={4} fontSize="sm" color="gray.500">
              <Box>
                Start:{" "}
                {new Date(meeting.startTime).toLocaleString("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Asia/Tokyo"
                })}
              </Box>
              <Box>
                End:{" "}
                {new Date(meeting.endTime).toLocaleString("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Asia/Tokyo"
                })}
              </Box>
            </Box>
            <Box mt={2}>
              <Box as="h3" fontSize="sm" fontWeight="semibold">
                Participants:
              </Box>
              <Box display="flex" flexWrap="wrap" gap={2} mt={1}>
                {meeting.participants.map((participant) => (
                  <Box
                    key={participant.id}
                    bg="gray.100"
                    px={2}
                    py={1}
                    borderRadius="md"
                    fontSize="sm"
                  >
                    {participant.user.username}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmation of meeting deletion</ModalHeader>
          <ModalBody>
          Are you sure you want to delete this meeting?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
