import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Container, VStack, Heading } from '@chakra-ui/react';
import { CreateMeetingForm } from "./_components/CreateMeetingForm";
import { getLabAvailableSlots } from "./action";
import { authOption } from "@/lib/next-auth/auth";

export default async function CreateMeetingPage() {
  const session = await getServerSession(authOption);
  
  if (!session) {
    redirect("/auth/signin");
  }

  const labId = session.user.labId ?? "";
  const labMembers = await getLabAvailableSlots(labId);

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Create New Meeting</Heading>
        <CreateMeetingForm initialLabMembers={labMembers} />
      </VStack>
    </Container>
  );
}
