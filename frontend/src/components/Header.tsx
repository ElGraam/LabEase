import HeaderActionMenu from "@/components/HeaderActionMenu";
import { Box, Flex, Image, Link, SystemStyleObject } from "@chakra-ui/react";
import NextLink from "next/link";
import HamburgerMenu from "@/components/HamburgerMenu";

const Header = async () => {
  // 背景のBox
  const bgStyle: SystemStyleObject = {
    position: "sticky",
    top: "0",
    zIndex: "sticky",
    backgroundColor: "#FFFFFF",
    width: "100%",
    boxShadow: "base",
  };

  // コンテンツ余白のスタイル
  const boxStyle: SystemStyleObject = {
    maxWidth: "1140px",
    padding: "0 20px",
    margin: "0 auto",
  };

  // ヘッダーコンテントのFlexスタイル
  const contentFlexStyle: SystemStyleObject = {
    backgroundColor: "white",
    width: "100%",
    height: "64px",
    alignItems: "center",
    justifyContent: "space-between",
  };

  // ロゴ部分のFlexスタイル
  const logoFlexStyle: SystemStyleObject = {
    alignItems: "center",
    gap: "16px", // ロゴとハンバーガーメニューの間のスペースを設定
    display: "flex",
  };

  // ヘッダーのロゴ画像のスタイル
  const logoStyle: SystemStyleObject = {
    maxWidth: { base: "221px", md: "unset" },
  };

  // ヘッダーのロゴ画像スタイル
  const logoImageStyle: SystemStyleObject = {
    height: "40px",
  };

  // メニューを含む右側エリアのFlexスタイル
  const rightMenuStyle: SystemStyleObject = {
    alignItems: "center",
    gap: "20px", // メニュー間の余白
    display: "flex",
  };

  return (
    <Box as="header" sx={bgStyle}>
      <Box sx={boxStyle}>
        <Flex sx={contentFlexStyle}>
          {/* 左側のロゴとハンバーガーメニュー */}
          <Flex sx={logoFlexStyle}>
            {/* ハンバーガーメニュー */}
            <HamburgerMenu />
            {/* ロゴ部分 */}
            <Link as={NextLink} href="/" sx={logoStyle}>
              <Image src="/univ-logo.png" alt="Logo" sx={logoImageStyle} />
            </Link>
          </Flex>

          {/* メニュー部分 */}
          <Flex sx={rightMenuStyle}>
            {/* アクションメニュー */}
            <HeaderActionMenu />
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default Header;
