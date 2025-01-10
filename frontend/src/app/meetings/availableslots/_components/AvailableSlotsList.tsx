"use client";
import { AvailableSlot } from "@/types";
import { deleteAvailableSlot } from "../action";
import { Box, Button, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

const DayOfWeekMap: Record<number, string> = {
  0: "日曜日",
  1: "月曜日",
  2: "火曜日",
  3: "水曜日",
  4: "木曜日",
  5: "金曜日",
  6: "土曜日"
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
            <Th>曜日</Th>
            <Th>開始時間</Th>
            <Th>終了時間</Th>
            <Th>操作</Th>
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
                <Td>{new Date(slot.startTime).toLocaleString()}</Td>
                <Td>{new Date(slot.endTime).toLocaleString()}</Td>
                <Td>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDelete(slot.id)}
                  >
                    削除
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