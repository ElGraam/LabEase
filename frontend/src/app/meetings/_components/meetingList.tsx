'use client';

import { Users, Meeting } from '@/types';
import { Alert, AlertIcon, Box, Spinner } from '@chakra-ui/react';

type Props = {
  meetings: Meeting[];
};

export default function MeetingList({ meetings }: Props) {
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
    <Box display="flex" flexDirection="column" gap={4}>
        {meetings.map((meeting) => (
            <Box
                key={meeting.id}
                borderWidth="1px"
                borderRadius="lg"
                p={4}
                shadow="sm"
                _hover={{ shadow: 'md' }}
                transition="box-shadow 0.2s"
            >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        <Box as="h2" fontSize="xl" fontWeight="semibold">{meeting.title}</Box>
                        <Box color="gray.600">{meeting.description}</Box>
                    </Box>
                    <Box bg="blue.100" color="blue.800" px={2} py={1} borderRadius="md" fontSize="sm">
                        {meeting.type}
                    </Box>
                </Box>
                <Box mt={4} fontSize="sm" color="gray.500">
                    <Box>Start: {new Date(meeting.startTime).toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</Box>
                    <Box>End: {new Date(meeting.endTime).toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</Box>
                </Box>
                <Box mt={2}>
                    <Box as="h3" fontSize="sm" fontWeight="semibold">Participants:</Box>
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
);
}
