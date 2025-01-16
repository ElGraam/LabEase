"use client";

import {
  Box,
  Checkbox,
  VStack,
  Text,
  Card,
  CardBody,
  Badge
} from '@chakra-ui/react';

interface AvailableSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  dayOfWeek: number;
}

interface Member {
  id: string;
  username: string;
  availableSlots: AvailableSlot[];
}

interface Props {
  member: Member;
  isSelected: boolean;
  isAvailable: boolean;
  onSelect: (memberId: string) => void;
  showAllSlots?: boolean; // 全スロットを表示するかどうか
}

export const MemberAvailability = ({ 
  member, 
  isSelected, 
  isAvailable, 
  onSelect,
  showAllSlots = false 
}: Props) => {
  // スロットの表示制御
  const displaySlots = member.availableSlots
    .filter(slot => {
      const slotDate = new Date(slot.startTime);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return slotDate >= weekAgo;
    })
    .slice(0, showAllSlots ? undefined : 3); // 選択時は全て表示、未選択時は3件まで

  return (
    <Card
      variant="outline"
      borderColor={isSelected ? 'blue.500' : 'gray.200'}
      opacity={isAvailable ? 1 : 0.5}
      transition="all 0.2s"
      _hover={{ shadow: isAvailable ? 'md' : 'none' }}
    >
      <CardBody>
        <VStack align="stretch" spacing={3}>
          <Box display="flex" alignItems="center" gap={3}>
            <Checkbox
              isChecked={isSelected}
              onChange={() => onSelect(member.id)}
              isDisabled={!isAvailable}
              colorScheme="blue"
            />
            <Text fontWeight="semibold">
              {member.username}
              {!isAvailable && (
                <Badge ml={2} colorScheme="red">
                  時間外
                </Badge>
              )}
            </Text>
          </Box>
          <VStack align="stretch" spacing={2}>
            {displaySlots.map((slot) => (
              <Badge
                key={slot.id}
                p={2}
                borderRadius="md"
                variant="subtle"
                colorScheme="green"
              >
                {new Date(slot.startTime).toLocaleString("ja-JP", {
                  month: 'short',
                  day: 'numeric',
                  weekday: 'short',
                  hour: 'numeric',
                  minute: '2-digit',
                  timeZone: 'Asia/Tokyo'
                })}
                {' - '}
                {new Date(slot.endTime).toLocaleString("ja-JP", {
                  hour: 'numeric',
                  minute: '2-digit',
                  timeZone: 'Asia/Tokyo'
                })}
              </Badge>
            ))}
            {!showAllSlots && member.availableSlots.length > 3 && (
              <Text fontSize="sm" color="gray.500">
                他 {member.availableSlots.length - 3} 件の予定あり
              </Text>
            )}
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
};