"use client";
import { createAvailableSlots } from "../action";
import { Button, Flex, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import { useState } from "react";

type Props = {
  userId: string;
  onSuccess: () => void;
};

const CreateAvailableSlotsForm = ({ userId, onSuccess }: Props) => {
  const [dayOfWeek, setDayOfWeek] = useState<string>("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAvailableSlots(
      userId,
      parseInt(dayOfWeek), // 文字列を数値に変換
      new Date(startTime),
      new Date(endTime)
    );
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction="column" gap={4}>
        <FormControl>
          <FormLabel>曜日</FormLabel>
          <Select 
            value={dayOfWeek} 
            onChange={(e) => setDayOfWeek(e.target.value)}
            required
          >
            <option value="">選択してください</option>
            <option value="0">日曜日</option>
            <option value="1">月曜日</option>
            <option value="2">火曜日</option>
            <option value="3">水曜日</option>
            <option value="4">木曜日</option>
            <option value="5">金曜日</option>
            <option value="6">土曜日</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>開始時間</FormLabel>
          <Input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </FormControl>
        <FormControl>
          <FormLabel>終了時間</FormLabel>
          <Input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </FormControl>
        <Button type="submit" colorScheme="blue">
          作成
        </Button>
      </Flex>
    </form>
  );
};

export default CreateAvailableSlotsForm;
