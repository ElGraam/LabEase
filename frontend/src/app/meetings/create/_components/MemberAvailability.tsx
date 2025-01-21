"use client";

import {
  Box,
  Checkbox,
  VStack,
  Text,
  Card,
  CardBody,
  Badge,
} from "@chakra-ui/react";

interface AvailableSlot {
  id: string;
  startTime: Date;
  endTime: Date;
}

interface Member {
  id: string;
  username: string;
  availableSlots: AvailableSlot[];
}

interface Props {
  member: Member;
  isSelected: boolean;
  onSelect: (memberId: string) => void;
  selectedWeekRange: { weekStart: Date; weekEnd: Date } | null;
}

export const MemberAvailability = ({
  member,
  isSelected,
  onSelect,
  selectedWeekRange,
}: Props) => {
  // 選択された週の空き時間をフィルタリング
  const weekSlots = selectedWeekRange
    ? member.availableSlots.filter((slot) => {
        const slotDate = new Date(slot.startTime);
        return (
          slotDate >= selectedWeekRange.weekStart &&
          slotDate <= selectedWeekRange.weekEnd
        );
      })
    : [];

  return (
    <Card
      variant="outline"
      borderColor={isSelected ? "blue.500" : "gray.200"}
      transition="all 0.2s"
      _hover={{ shadow: "md" }}
    >
      <CardBody>
        <VStack align="stretch" spacing={3}>
          <Box display="flex" alignItems="center" gap={3}>
            <Checkbox
              isChecked={isSelected}
              onChange={() => onSelect(member.id)}
              colorScheme="blue"
            />
            <Text fontWeight="semibold">{member.username}</Text>
          </Box>

          {selectedWeekRange && weekSlots.length > 0 && (
            <VStack align="stretch" spacing={2}>
              {weekSlots.map((slot) => (
                <Badge
                  key={slot.id}
                  p={2}
                  borderRadius="md"
                  variant="subtle"
                  colorScheme="green"
                >
                  {new Date(slot.startTime).toLocaleString("ja-JP", {
                    month: "short",
                    day: "numeric",
                    weekday: "short",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                  {" - "}
                  {new Date(slot.endTime).toLocaleString("ja-JP", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </Badge>
              ))}
            </VStack>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};
