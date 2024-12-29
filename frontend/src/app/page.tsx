import HomeHeader from "@/components/HomeHeader";
import { Button, Heading, SystemStyleObject, VStack } from "@chakra-ui/react";
import NextLink from "next/link";

const Home = async () => {
  // タイトルのスタイル
  const titleStyle: SystemStyleObject = {
    fontSize: "app.header1",
    fontWeight: "bold",
  };

  // VStackスタイル
  const vStackStyle: SystemStyleObject = {
    marginTop: "60px",
    marginBottom: "60px",
    width: "100%",
    gap: "30px",
  };

  // 見るボタンスタイル
  const moreViewButtonStyle: SystemStyleObject = {
    width: "240px",
    height: "48px",
    borderRadius: "9999px",
  };

  return (
    <>
      <HomeHeader />
      <VStack sx={vStackStyle}>
        <Heading as="h2" sx={titleStyle}>
          研究一覧
        </Heading>
        <Button
          sx={moreViewButtonStyle}
          colorScheme="blue"
          variant="outline"
          as={NextLink}
          href=""
        >
          もっと見る
        </Button>
      </VStack>
    </>
  );
};

export default Home;
