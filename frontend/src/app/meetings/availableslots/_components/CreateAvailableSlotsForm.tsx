"use client";
import { createAvailableSlots } from "../action";
import { Button, Flex, FormControl, FormLabel, Input, Select, useToast } from "@chakra-ui/react";
import { useState } from "react";

type Props = {
  userId: string;
  onSuccess: () => void;
};

const CreateAvailableSlotsForm = ({ userId, onSuccess }: Props) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const toast = useToast();

  const isValidTimeRange = (start: Date, end: Date): boolean => {
    const startHour = start.getHours();
    const endHour = end.getHours();

    // 22時から5時までの時間帯をチェック
    if (startHour >= 22 || startHour < 5 || endHour >= 22 || endHour < 5) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const startDate = new Date(startTime + ':00');
      const endDate = new Date(endTime + ':00');

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('The date format is invalid.')
      }
      if (startDate >= endDate) {
        toast({
          title: "The date format is invalid.",
          description: "Please set the end time to be later than the start time.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      if (startDate.getDay() !== endDate.getDay()) {
        toast({
          title: "The date format is invalid.",
          description: "Please set the start time and end time on the same day.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (!isValidTimeRange(startDate, endDate)) {
        toast({
          title: "The date format is invalid.",
          description: "The time period from 10:00 PM to 5:00 AM cannot be set.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // 日付から曜日を取得（0-6の数値）
      const dayOfWeek = startDate.getDay();

      await createAvailableSlots(
        userId,
        dayOfWeek,
        startDate,
        endDate
      );
      onSuccess();
      toast({
        title: "Availability has been created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "An error has occurred.",
        description: error instanceof Error ? error.message : "An unexpected error has occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction="column" gap={4}>
        <FormControl>
          <FormLabel>Start time</FormLabel>
          <Input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </FormControl>
        <FormControl>
          <FormLabel>End time</FormLabel>
          <Input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </FormControl>
        <Button type="submit" colorScheme="blue">
          Create
        </Button>
      </Flex>
    </form>
  );
};

export default CreateAvailableSlotsForm;
