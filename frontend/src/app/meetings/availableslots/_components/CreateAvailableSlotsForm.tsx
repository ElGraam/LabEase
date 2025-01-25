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
  // Class1
  options.push(`${"9".padStart(2, "0")}:00`);
  options.push(`${"9".padStart(2, "0")}:50`);
  // Class2
  options.push(`${"10".padStart(2, "0")}:40`);
  // Class3
  options.push(`${"10".padStart(2, "0")}:50`);
  options.push(`${"11".padStart(2, "0")}:40`);
  // Class4
  options.push(`${"12".padStart(2, "0")}:30`);
  // Class5
  options.push(`${"13".padStart(2, "0")}:20`);
  options.push(`${"14".padStart(2, "0")}:10`);
  // Class6
  options.push(`${"15".padStart(2, "0")}:00`);
  // Class7
  options.push(`${"15".padStart(2, "0")}:10`);
  options.push(`${"16".padStart(2, "0")}:00`);
  // Class8
  options.push(`${"16".padStart(2, "0")}:50`);
  // Class9
  options.push(`${"17".padStart(2, "0")}:00`);
  options.push(`${"17".padStart(2, "0")}:50`);
  // Class10
  options.push(`${"18".padStart(2, "0")}:40`);
  // Class11
  options.push(`${"18".padStart(2, "0")}:50`);
  options.push(`${"19".padStart(2, "0")}:40`);

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

      if (startDate.getDay() === 0 || startDate.getDay() === 6) {
        toast({
          title: "Invalid date",
          description: "Weekends (Saturday and Sunday) cannot be selected.",
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
            onChange={(e) => {
              const selectedDate = new Date(e.target.value);
              if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
                toast({
                  title: "Invalid date",
                  description: "Weekends (Saturday and Sunday) cannot be selected.",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                });
                return;
              }
              setDate(e.target.value);
            }}
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