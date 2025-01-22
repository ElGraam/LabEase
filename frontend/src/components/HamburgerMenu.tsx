"use client";

import React, { useState } from "react";
import { Box, Flex, Link, VStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const role = session?.user.role;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box position="relative">
      {/* ハンバーガーアイコン */}
      <Box
        as="button"
        onClick={toggleMenu}
        display="flex"
        flexDirection="column"
        justifyContent="space-around"
        width="30px"
        height="25px"
        cursor="pointer"
      >
        <Box
          height="4px"
          width="100%"
          backgroundColor="gray.800"
          transition="0.3s"
          transform={isOpen ? "rotate(45deg) translateY(8px)" : "none"}
        />
        <Box
          height="4px"
          width="100%"
          backgroundColor="gray.800"
          transition="0.3s"
          opacity={isOpen ? 0 : 1}
        />
        <Box
          height="4px"
          width="100%"
          backgroundColor="gray.800"
          transition="0.3s"
          transform={isOpen ? "rotate(-45deg) translateY(-8px)" : "none"}
        />
      </Box>

      {/* メニュー */}
      <Box
        position="absolute"
        top="50px"
        left="0"
        width="200px"
        backgroundColor="gray.700"
        borderRadius="md"
        display={isOpen ? "block" : "none"}
        p="4"
      >
        <VStack as="ul" spacing="4" align="stretch" listStyleType="none">
          <Box as="li">
            <Link
              href="/"
              color="white"
              _hover={{ bg: "gray.600", p: "2", borderRadius: "md" }}
            >
              Home
            </Link>
          </Box>
          <Box as="li">
            <Link
              href="/dashboard"
              color="white"
              _hover={{ bg: "gray.600", p: "2", borderRadius: "md" }}
            >
              Dashboard
            </Link>
          </Box>
          {role !== "STUDENT" && (
            <Box as="li">
              <Link
                href="/lab"
                color="white"
                _hover={{ bg: "gray.600", p: "2", borderRadius: "md" }}
              >
                Lab Registration
              </Link>
            </Box>
          )}
          <Box as="li">
            <Link
              href="/projects"
              color="white"
              _hover={{ bg: "gray.600", p: "2", borderRadius: "md" }}
            >
              Lab Projects
            </Link>
          </Box>
          <Box as="li">
            <Link
              href="/meetings"
              color="white"
              _hover={{ bg: "gray.600", p: "2", borderRadius: "md" }}
            >
              Meetings
            </Link>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default HamburgerMenu;
