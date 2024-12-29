"use client";

import {
  ChevronDownIcon,
  SearchIcon,
  TriangleDownIcon,
} from "@chakra-ui/icons";
import {
  baseTheme,
  Box,
  Button,
  Input,
  InputGroup,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SystemStyleObject,
} from "@chakra-ui/react";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useState } from "react";

const SearchBox = ({ isBookmark }: { isBookmark: boolean }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname() || "";

  // 並び替えの状態を管理
  const [sortOrder, setSortOrder] = useState<string>(
    searchParams?.get("sort") || "new",
  );

  const SortMap: { [key: string]: string } = {
    studentId: "studentId",
  };

  /** 検索ボタン押下時の処理 */
  const onSubmit = (data: FormData) => {
    const keyword = data.get("keyword") as string;
    const newParams = new URLSearchParams(searchParams?.toString());

    if (keyword) {
      newParams.set("keyword", keyword);
    } else {
      newParams.delete("keyword");
    }

    // 並び替え条件もクエリパラメータに追加
    if (sortOrder) {
      newParams.set("sort", sortOrder);
    }

    newParams.delete("offset");
    router.push(createUrl(pathname, newParams));
  };

  // 並び替えオプションの変更処理
  const onSortChange = (sort: string) => {
    setSortOrder(sort);
    const newParams = new URLSearchParams(searchParams?.toString());
    newParams.set("sort", sort);
    router.push(createUrl(pathname, newParams));
  };

  // sp表示用
  const FormStyle: SystemStyleObject = {
    width: { base: "100%", md: "726px" },
    ".searchForm": {
      width: "100%",
    },
  };

  const InputStyle: SystemStyleObject = {
    background: "app.bg",
    borderRadius: "20px 0 0 20px",
    borderColor: "app.border",
    borderWidth: "1px",
    width: { base: "80%", md: "600px" },
  };

  const InputStyleForBookmark: SystemStyleObject = {
    background: "app.bg",
    borderRadius: "20px 0 0 20px",
    borderColor: "app.border",
    borderWidth: "1px",
    width: { base: "100%", md: "600px" },
  };

  const IconButtonStyle: SystemStyleObject = {
    background: "#fff",
    borderRightRadius: "full",
    borderColor: "app.border",
    width: "48px",
  };

  return (
    <Box sx={FormStyle}>
      <form className="searchForm" action={onSubmit}>
        <InputGroup sx={FormStyle}>
          <Input
            type="text"
            name="keyword"
            id="keyword"
            variant="filled"
            placeholder="キーワードで検索する"
            defaultValue={searchParams?.get("keyword") || ""}
            sx={isBookmark ? InputStyleForBookmark : InputStyle}
          />
          <Button
            type="submit"
            variant="outline"
            aria-label="Search Lab"
            sx={IconButtonStyle}
            mr={4}
          >
            <SearchIcon />
          </Button>
          {!isBookmark && (
            <Menu>
              <MenuButton
                as={Button}
                color="gray.600"
                bg="white"
                shadow="md"
                borderRadius="lg"
                _hover={{ bg: "gray.100" }} // hover時の背景色
                _active={{ bg: "gray.200" }} // クリック時の背景色
                rightIcon={<TriangleDownIcon w={3} h={3} />}
                px={4} // ボタンの左右余白
                py={2} // ボタンの上下余白
                fontWeight="bold" // ボタンの文字の太さ
                fontSize="sm"
                w={48}
              >
                {SortMap[sortOrder]}
              </MenuButton>
              <MenuList>
                {Object.keys(SortMap).map((key, i) => {
                  return (
                    <MenuItem
                      onClick={() => onSortChange(key)}
                      value={key}
                      key={i}
                    >
                      {SortMap[key]}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Menu>
          )}
        </InputGroup>
      </form>
    </Box>
  );
};

export default SearchBox;

// URL生成用
const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams,
) => {
  const paramsString = params.toString();
  const queryString = paramsString && `?${paramsString}`;
  return `${pathname}${queryString}`;
};
