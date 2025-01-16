"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  SimpleGrid,
  useToast,
  Heading,
} from '@chakra-ui/react';
import { MemberAvailability } from "./MemberAvailability";
import { createMeeting } from "../action";
import { MeetingType } from "@/types";
import type { LabMembersSlots } from "../action";

const generateTimeOptions = () => {
  const options = [];
  for (let hour = 5; hour < 22; hour++) {
    options.push(`${hour.toString().padStart(2, '0')}:00`);
    options.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  options.push(`${'22'.padStart(2, '0')}:00`);
  return options;
};

interface Props {
  initialLabMembers: LabMembersSlots;
}

export function CreateMeetingForm({ initialLabMembers }: Props) {
  const router = useRouter();
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: MeetingType.REGULAR,
    date: "",
    startTime: "",
    endTime: ""
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const timeOptions = generateTimeOptions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const startDateTime = new Date(`${formData.date}T${formData.startTime}:00`);
      const endDateTime = new Date(`${formData.date}T${formData.endTime}:00`);

      if (startDateTime >= endDateTime) {
        toast({
          title: "時間の指定が不正です",
          description: "終了時間は開始時間より後に設定してください",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      await createMeeting(
        formData.type,
        formData.title,
        formData.description,
        startDateTime,
        endDateTime,
        selectedMembers
      );
      
      toast({
        title: "会議を作成しました",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/meetings");
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "会議の作成に失敗しました",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  // 選択された日付の週の範囲を計算
  const weekRange = useMemo(() => {
    if (!formData.date) return null;

    const startDate = new Date(`${formData.date}T${formData.startTime || '00:00'}:00`);
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() - 3); 
    const weekEnd = new Date(startDate);
    weekEnd.setDate(startDate.getDate() + 3); 

    return { weekStart, weekEnd };
  }, [formData.date, formData.startTime]);

  const displayMembers = initialLabMembers.members;

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={6} align="stretch">
        <FormControl isRequired>
          <FormLabel>タイトル</FormLabel>
          <Input
            value={formData.title}
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
        </FormControl>

        <FormControl>
          <FormLabel>説明</FormLabel>
          <Textarea
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </FormControl>

        <SimpleGrid columns={3} spacing={4}>
          <FormControl isRequired>
            <FormLabel>日付</FormLabel>
            <Input
              type="date"
              value={formData.date}
              onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>開始時間</FormLabel>
            <Select
              value={formData.startTime}
              onChange={e => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              required
            >
              <option value="">開始時間を選択</option>
              {timeOptions.map((time) => (
                <option key={`start-${time}`} value={time}>
                  {time}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>終了時間</FormLabel>
            <Select
              value={formData.endTime}
              onChange={e => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              required
            >
              <option value="">終了時間を選択</option>
              {timeOptions.map((time) => (
                <option key={`end-${time}`} value={time}>
                  {time}
                </option>
              ))}
            </Select>
          </FormControl>
        </SimpleGrid>

        <FormControl isRequired>
          <FormLabel>会議タイプ</FormLabel>
          <Select
            value={formData.type}
            onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as MeetingType }))}
          >
            <option value={MeetingType.REGULAR}>定例会議</option>
            <option value={MeetingType.SPONTANEOUS}>臨時会議</option>
          </Select>
        </FormControl>

        <Box>
          <Heading size="md" mb={4}>
            参加者選択 (全{initialLabMembers.members.length}人)
          </Heading>
          <SimpleGrid columns={[1, 2, 3]} spacing={4}>
            {displayMembers.map((member) => (
              <MemberAvailability
                key={member.id}
                member={member}
                isSelected={selectedMembers.includes(member.id)}
                onSelect={toggleMemberSelection}
                selectedWeekRange={weekRange}
              />
            ))}
          </SimpleGrid>
        </Box>

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          isLoading={loading}
          loadingText="作成中..."
          isDisabled={selectedMembers.length === 0}
        >
          会議を作成
        </Button>
      </VStack>
    </Box>
  );
}
