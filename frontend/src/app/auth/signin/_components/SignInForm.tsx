"use client";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  SystemStyleObject,
  Text,
  VStack,
} from "@chakra-ui/react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

const SignInForm = () => {
  const router = useRouter();

  /**　ログインボタン押下時の処理   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // この関数内で動作を制御するため既定処理は行わない
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    // ログイン処理
    const res = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    // エラー処理
    if (res?.error) {
      console.error("Sign in error:", res);
      return;
    }

    // ログイン成功時の処理
    if (res?.ok) {
      const userInfo = await getSession();
      userInfo && router.push(`/lab/`);
    }
  };

  const vStackStyle: SystemStyleObject = {
    margin: "60px auto",
    width: "100%",
    maxWidth: "725px",
    gap: "30px",
    textAlign: "center",
  };

  const titleStyle: SystemStyleObject = {
    fontSize: "app.header1",
  };

  const formBoxStyle: SystemStyleObject = {
    width: "100%",
  };

  const formVStackStyle: SystemStyleObject = {
    gap: "15px",
  };

  const formSubLabelStyle: SystemStyleObject = {
    marginTop: "-5px",
    textAlign: "left",
    fontSize: "12px",
  };

  const linkStyle: SystemStyleObject = {
    color: "app.blue",
    fontWeight: "bold",
  };

  const formLabelStyle: SystemStyleObject = {
    fontWeight: "bold",
  };

  return (
    <VStack sx={vStackStyle}>
      <Box as="form" onSubmit={handleSubmit} sx={formBoxStyle}>
        <VStack sx={formVStackStyle}>
          <Heading as="h2" sx={titleStyle}>
            ユーザーログイン
          </Heading>
          <FormControl isRequired>
            <FormLabel sx={formLabelStyle}>メールアドレス</FormLabel>
            <Text sx={formSubLabelStyle}>
              {" "}
              大学のドメインを使用してください。
            </Text>
            <Input
              placeholder="メールアドレス"
              type="email"
              id="email"
              name="email"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel sx={formLabelStyle}>パスワード</FormLabel>
            <Input
              placeholder="パスワード"
              type="password"
              id="password"
              name="password"
            />
          </FormControl>
          <Button colorScheme="blue" type="submit">
            ログイン
          </Button>
        </VStack>
      </Box>
    </VStack>
  );
};

export default SignInForm;
