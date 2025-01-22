"use client";
import { createAvailableSlots } from "../action";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

const generateTimeOptions = () => {
  const options = [];
  for (let hour = 5; hour < 22; hour++) {
    options.push(`${hour.toString().padStart(2, "0")}:00`);
    options.push(`${hour.toString().padStart(2, "0")}:30`);
  }
  options.push(`${"22".padStart(2, "0")}:00`);

  return options;
};

type Props = {
  userId: string;
  onSuccess: () => void;
};

const CreateAvailableSlotsForm = ({ userId, onSuccess }: Props) => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const toast = useToast();
  const timeOptions = generateTimeOptions();

  const isValidTimeRange = (start: Date, end: Date): boolean => {
    const startHour = start.getHours();
    const endHour = end.getHours();

    // 22時から5時までの時間帯をチェック
    if (startHour > 22 || startHour < 5 || endHour > 22 || endHour < 5) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const startDate = new Date(`${date}T${startTime}:00`);
      const endDate = new Date(`${date}T${endTime}:00`);
      const currentDate = new Date();

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Invalid date format.");
      }

      if (startDate >= endDate) {
        toast({
          title: "Invalid time format",
          description: "End time must be later than start time.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (startDate.getDay() !== endDate.getDay()) {
        toast({
          title: "Invalid date format",
          description: "Start time and end time must be on the same day.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (startDate < currentDate || endDate < currentDate) {
        toast({
          title: "Invalid date format",
          description: "Cannot set past dates.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (!isValidTimeRange(startDate, endDate)) {
        toast({
          title: "Invalid time format",
          description: "Cannot set times between 10 PM and 5 AM.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const dayOfWeek = startDate.getDay();

      await createAvailableSlots(userId, dayOfWeek, startDate, endDate);
      onSuccess();
      toast({
        title: "Available time slot created successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "An error has occurred.",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error has occurred.",
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
          <FormLabel>Date</FormLabel>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </FormControl>
        <FormControl>
          <FormLabel>Start time</FormLabel>
          <Select
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          >
            <option value="">Select start time</option>
            {timeOptions.map((time) => (
              <option key={`start-${time}`} value={time}>
                {time}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>End time</FormLabel>
          <Select
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          >
            <option value="">Select end time</option>
            {timeOptions.map((time) => (
              <option key={`end-${time}`} value={time}>
                {time}
              </option>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" colorScheme="blue">
          Create
        </Button>
      </Flex>
    </form>
  );
};

export default CreateAvailableSlotsForm;
