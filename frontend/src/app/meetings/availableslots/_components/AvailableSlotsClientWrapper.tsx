"use client";
import { AvailableSlot } from "@/types";
import { useRouter } from "next/navigation";
import CreateAvailableSlotsForm from "./CreateAvailableSlotsForm";
import AvailableSlotsList from "./AvailableSlotsList";
import { Box, Heading } from "@chakra-ui/react";
import Pagination from "@/app/lab/_components/Pagination";

type Props = {
  userId: string;
  slots: AvailableSlot[];
  offset: number;
  totalCount: number;
};

export default function AvailableSlotsClientWrapper({ 
  userId, 
  slots,
  offset,
  totalCount
}: Props) {
  const router = useRouter();
  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <>
      <Box p={4} borderWidth={1} borderRadius="lg">
        <Heading size="md" mb={4}>空き時間の作成</Heading>
        <CreateAvailableSlotsForm userId={userId} onSuccess={handleSuccess} />
      </Box>

      <Box p={4} borderWidth={1} borderRadius="lg">
        <Heading size="md" mb={4}>空き時間一覧</Heading>
        <AvailableSlotsList availableSlots={slots} onDelete={handleSuccess} />
        <Box mt={4}>
          <Pagination
            keyword=""
            offset={offset}
            totalCount={totalCount}
          />
        </Box>
      </Box>
    </>
  );
}
