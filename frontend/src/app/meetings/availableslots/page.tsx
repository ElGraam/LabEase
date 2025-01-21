import { getAvailableSlots } from "./action";
import { Container, Heading, VStack, Box, Button } from "@chakra-ui/react";
import { ITEM_LIMIT } from "@/const";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/next-auth/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AvailableSlotsClientWrapper from "./_components/AvailableSlotsClientWrapper";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

type Props = {
  searchParams: {
    offset?: string;
  };
};

export default async function AvailableSlotsPage({ searchParams }: Props) {
  const session = await getServerSession(authOption);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }
  
  const offset = searchParams.offset ? parseInt(searchParams.offset) : 0;
  const { availableSlots, totalCount } = await getAvailableSlots(
    session.user.id, 
    offset, 
    ITEM_LIMIT
  );

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Button
            as={Link}
            href="/meetings"
            leftIcon={<FaArrowLeft />}
            colorScheme="gray"
            variant="ghost"
            size="sm"
            mb={4}
          >
            Back to meetings list
          </Button>
        </Box>
        <Heading size="lg">Availability Management</Heading>
        <Suspense fallback={<Box>Loading...</Box>}>
          <AvailableSlotsClientWrapper 
            userId={session.user.id} 
            slots={availableSlots} 
            offset={offset}
            totalCount={totalCount}
          />
        </Suspense>
      </VStack>
    </Container>
  );
}
