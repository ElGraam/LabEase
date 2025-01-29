"use client";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  SystemStyleObject,
} from "@chakra-ui/react";

const HomeHeader = () => {
  const flexStyle: SystemStyleObject = {
    backgroundColor: "app.bg",
    width: "100vw",
    minHeight: { base: "600px", md: "600px" },
    marginLeft: "calc(50% - 50vw)",
    marginTop: "-1px",
    paddingBottom: { base: "28px", md: "0" },
    position: "relative",
    zIndex: "0",
    flexDirection: { base: "column", md: "row-reverse" },
    justifyContent: { base: "center", md: "center" },
    alignItems: { base: "center", md: "center" },
    gap: { base: "24px", md: "0" },
  };

  const mainImageFlexStyle: SystemStyleObject = {
    maxWidth: { base: "calc(100% -   50px)", md: "750px" },
    height: "auto",
  };

  const mainImageStyle: SystemStyleObject = {
    position: "relative",
    maxheight: "600px",
    filter: "drop-shadow( 0px 4px 8px rgba(0, 0, 0, 0.15))",
  };

  const headerContentFlexStyle: SystemStyleObject = {
    width: { base: "unset", md: "600px" },
    paddingLeft: { base: "0", md: "20px" },
    flexDirection: "column",
    alignItems: { base: "center", md: "flex-start" },
    justifyContent: "center",
  };

  const serviceLogoImageStyle: SystemStyleObject = {
    display: { base: "block", md: "none" },
    position: "relative",
    filter: "drop-shadow( 4px 4px 3px rgba(0, 0, 0, 0.08))",
    maxWidth: "206px",
    maxHeight: "33px",
  };

  // テキスト部分のBox
  const contentDetailBoxStyle: SystemStyleObject = {
    marginTop: { base: "16px", md: "31px" },
    textShadow: "4px 4px 6px rgba(0, 0, 0, 0.08)",
    whiteSpace: { base: "pre-wrap", md: "nowrap" },
  };

  // メインテキスト
  const detailTitleStyle: SystemStyleObject = {
    color: "app.blue",
    fontSize: { base: "24px", md: "clamp(32px, 3.6vw, 41.4px)" },
    fontWeight: "bold",
    textAlign: "center",
  };

  // 説明文
  const detailTextStyle: SystemStyleObject = {
    marginTop: { base: "16px", md: "20.7px" },
    fontSize: { base: "16px", md: "clamp(16px, 1.8vw, 20px)" },
    fontWeight: "bold",
    lineHeight: "150%",
    letterSpacing: { base: "0%", md: "4%" },
    textAlign: { base: "center", md: "left" },
  };

  // 「研究を見る」ボタン
  const viewButtonStyle: SystemStyleObject = {
    marginTop: { base: "28px", md: "48px" },
    width: "240px",
    height: "48px",
    rounded: "24px",
    fontSize: "16px",
    linnHeight: "150%",
    fontWeight: "bold",
  };

  return (
    <Flex as="section" sx={flexStyle}>
      <Flex sx={mainImageFlexStyle}>
        <Image
          src="/homeHeaderImage.png"
          alt="univ photo"
          sx={mainImageStyle}
        />
      </Flex>
      <Flex sx={headerContentFlexStyle}>
        <Image
          src="/univ-logo.png"
          alt="univのロゴ"
          sx={serviceLogoImageStyle}
        />
        <Box sx={contentDetailBoxStyle}>
          <Heading as="h3" sx={detailTitleStyle}>
            Efficient
          </Heading>
          <Heading as="h4" sx={detailTextStyle}>
            Lab Management System
            <br />
            to support research activities
          </Heading>
        </Box>
      </Flex>
    </Flex>
  );
};

export default HomeHeader;
