"use client";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tag,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
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
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Project Name</Th>
              <Th>Description</Th>
              <Th>Milestone</Th>
              <Th>Status</Th>
              <Th>Due Date</Th>
              <Th>Completion Date</Th>
              {canDelete && <Th>Actions</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {projects.map((project) => (
              <Tr key={project.id}>
                <Td>
                  <Link href={`/projects/${project.id}`}>{project.title}</Link>
                </Td>
                <Td>{project.description}</Td>
                <Td>
                  {/* プロジェクトのステータスをタグで表示 */}
                  {project.milestones &&
                    project.milestones[0] &&
                    project.milestones[0].description}
                </Td>
                <Td>
                  {/* マイルストーンのステータスをタグで表示 */}
                  {project.milestones &&
                    project.milestones.map((milestone) => (
                      <Tag key={milestone.id} colorScheme="blue" mr={1}>
                        {milestone.status}
                      </Tag>
                    ))}
                </Td>
                <Td>
                  {new Date(
                    project.milestones?.[0]?.dueDate,
                  ).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </Td>
                <Td>
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
                </Td>
                {canDelete && (
                  <Td>
                    <IconButton
                      aria-label="Delete project"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleDeleteClick(project.id)}
                    />
                  </Td>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

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
