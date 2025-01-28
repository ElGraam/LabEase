"use client";
import {
  Box,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  IconButton,
  useToast,
  Alert,
  AlertIcon,
  Tag,
  TagLabel,
  HStack,
  Icon,
  Avatar,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { FiFlag } from "react-icons/fi";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Project } from "@/types";
import { useState } from "react";
import { deleteProject } from "../action";

type Props = {
  projects: Project[];
};

const ProjectList = ({ projects: initialProjects }: Props) => {
  const { data: session } = useSession();
  const [projects, setProjects] = useState(initialProjects);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [targetProjectId, setTargetProjectId] = useState<string>("");
  const toast = useToast();

  if (!session) return <p>Please log in.</p>;

  const userRole = session.user.role;
  const canDelete = userRole === "PROFESSOR" || userRole === "SUB_INSTRUCTOR";
  const canCreate = userRole === "PROFESSOR" || userRole === "SUB_INSTRUCTOR";

  const handleDeleteClick = (projectId: string) => {
    setTargetProjectId(projectId);
    onOpen();
  };

  const handleDelete = async () => {
    try {
      await deleteProject(targetProjectId);
      setProjects(projects.filter((project) => project.id !== targetProjectId));
      toast({
        title: "Project deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to delete project.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  return (
    <>
      {projects.length === 0 ? (
        <Box textAlign="center" py={4}>
        <Alert status="info">
          <AlertIcon />
          There are no projects.
        </Alert>
      </Box>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          gap={6}
        >
          {projects.map((project) => (
            <Box
              key={project.id}
              borderWidth="1px"
              borderRadius="xl"
              p={5}
              shadow="sm"
              position="relative"
              _hover={{
                shadow: "lg",
                transform: "translateY(-2px)",
                borderColor: "blue.200",
              }}
              transition="all 0.2s"
              bg="white"
            >
              {canDelete && (
                <IconButton
                  aria-label="Delete project"
                  icon={<DeleteIcon />}
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  position="absolute"
                  top={3}
                  right={3}
                  opacity={0.6}
                  _hover={{ opacity: 1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(project.id);
                  }}
                />
              )}

              <Link
                href={`/projects/${project.id}`}
                style={{ textDecoration: "none" }}
              >
                <Box>
                  <Box mb={4}>
                    <Box
                      as="h2"
                      fontSize="xl"
                      fontWeight="bold"
                      mb={2}
                      color="gray.800"
                    >
                      {project.title}
                    </Box>
                    <Box color="gray.600" fontSize="sm" noOfLines={2}>
                      {project.description}
                    </Box>
                  </Box>

                  <Box mb={4}>
                    <HStack spacing={2} mb={2}>
                      <Icon as={FiFlag} color="blue.500" />
                      <Box
                        as="h3"
                        fontSize="sm"
                        fontWeight="semibold"
                        color="gray.700"
                      >
                        Milestone Status
                      </Box>
                    </HStack>
                    <Box>
                      {project.milestones &&
                        project.milestones.map((milestone) => (
                          <Tag
                            key={milestone.id}
                            size="md"
                            variant="subtle"
                            colorScheme={
                              milestone.status === "COMPLETED"
                                ? "green"
                                : milestone.status === "IN_PROGRESS"
                                  ? "blue"
                                  : milestone.status === "PLANNED"
                                    ? "yellow"
                                    : "red"
                            }
                            mr={2}
                            mb={2}
                          >
                            <TagLabel>{milestone.status}</TagLabel>
                          </Tag>
                        ))}
                    </Box>
                  </Box>

                  <Box p={3} bg="gray.50" borderRadius="md" fontSize="sm">
                    <Box mb={2}>
                      <Box color="gray.600" mb={1}>
                        Due Date:
                      </Box>
                      <Box fontWeight="medium" color="gray.800">
                        {project.milestones?.[0]?.dueDate
                          ? new Date(
                              project.milestones[0].dueDate,
                            ).toLocaleDateString("ja-JP", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              timeZone: "Asia/Tokyo",
                            })
                          : "-"}
                      </Box>
                    </Box>
                    <Box>
                      <Box color="gray.600" mb={1}>
                        Completion Date:
                      </Box>
                      <Box fontWeight="medium" color="gray.800">
                        {project.milestones?.[0]?.completionDate
                          ? new Date(
                              project.milestones[0].completionDate,
                            ).toLocaleDateString("ja-JP", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              timeZone: "Asia/Tokyo",
                            })
                          : "-"}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Link>
            </Box>
          ))}
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Project Deletion</ModalHeader>
          <ModalBody>Are you sure you want to delete this project?</ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProjectList;
