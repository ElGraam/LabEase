"use client";
import { AvailableSlot } from "@/types";
import { deleteAvailableSlot } from "../action";
import { Box, Button, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

const DayOfWeekMap: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday"  
};

type Props = {
  availableSlots: AvailableSlot[];
  onDelete: () => void;
};

const AvailableSlotsList = ({ availableSlots, onDelete }: Props) => {
  const handleDelete = async (id: string) => {
    await deleteAvailableSlot(id);
    onDelete();
  };

  // 配列でない場合や空の場合の処理
  const slots = Array.isArray(availableSlots) ? availableSlots : [];

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
          <Th>Day</Th>
          <Th>Start Time</Th>
          <Th>End Time</Th>
          <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {slots.length === 0 ? (
            <Tr>
              <Td colSpan={4} textAlign="center">空き時間が登録されていません</Td>
            </Tr>
          ) : (
            slots.map((slot: AvailableSlot) => (
              <Tr key={slot.id}>
                <Td>{DayOfWeekMap[slot.dayOfWeek]}</Td>
                <Td>{new Date(slot.startTime).toLocaleString("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Asia/Tokyo"
                  })}
                </Td>
                <Td>{new Date(slot.endTime).toLocaleString("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Asia/Tokyo"
                  })}
                </Td>
                <Td>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDelete(slot.id)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
}

export default AvailableSlotsList;