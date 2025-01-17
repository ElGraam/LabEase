"use client";
import { 
  Box, Table, Thead, Tbody, Tr, Th, Td, Tag,
  useDisclosure, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalFooter, Button,
  IconButton, useToast
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

  if (!session) return <p>ログインしてください。</p>;

  const userRole = session.user.role;
  const canDelete = userRole === "PROFESSOR" || userRole === "SUB_INSTRUCTOR";

  const handleDeleteClick = (projectId: string) => {
    setTargetProjectId(projectId);
    onOpen();
  };

  const handleDelete = async () => {
    try {
      await deleteProject(targetProjectId);
      setProjects(projects.filter(project => project.id !== targetProjectId));
      toast({
        title: "プロジェクトを削除しました。",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "削除に失敗しました。",
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
              <Th>プロジェクト名</Th>
              <Th>説明</Th>
              <Th>マイルストーン</Th>
              <Th>ステータス</Th>
              <Th>期限</Th>
              <Th>達成した日</Th>
              {canDelete && <Th>操作</Th>}
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
                  {new Date(project.milestones?.[0]?.dueDate).toLocaleDateString(
                    "ja-JP",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    },
                  )}
                </Td>
                <Td>
                  {new Date(
                    project.milestones?.[0]?.completionDate ?? "",
                  ).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    timeZone: "Asia/Tokyo",
                  })}
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
          <ModalHeader>プロジェクト削除の確認</ModalHeader>
          <ModalBody>
            このプロジェクトを削除してもよろしいですか？
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDelete}>
              削除
            </Button>
            <Button variant="ghost" onClick={onClose}>
              キャンセル
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProjectList;
