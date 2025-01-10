"use client";
import { ITEM_LIMIT } from "@/const";
/** @jsxImportSource @emotion/react */
import { Button, Flex } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { FC, ReactNode } from "react";

// Paginationコンポーネントの引数
type Props = {
  keyword: string;
  offset: number;
  totalCount: number;
};

const Pagination: FC<Props> = ({ keyword, offset, totalCount }) => {
  // ページ番号
  const currentPageNum = Math.floor(offset / ITEM_LIMIT);
  const endPageNum = Math.ceil(totalCount / ITEM_LIMIT) - 1;

  // 検索条件を保持した遷移先URLを作成
  const pathname = usePathname();
  const url =
    keyword !== ""
      ? `${pathname}?keyword=${encodeURIComponent(keyword)}&`
      : `${pathname}?`;

  // Pagenationボタンのコンポーネント
  const PaginationItem: FC<{
    active: boolean;
    offset: number;
    children: ReactNode;
  }> = ({ active, offset, children }) => {
    if (!active) {
      return <></>;
    }

    return (
      <Button
        as="a"
        variant="outline"
        borderRadius="20px"
        maxWidth="40px"
        href={`${url}offset=${offset}`}
      >
        {children}
      </Button>
    );
  };

  return (
    <Flex gap="5px" justifyContent="center" mt={4}>
      <PaginationItem active={currentPageNum > 2} offset={0}>
        {1}
      </PaginationItem>
      <PaginationItem active={currentPageNum > 3} offset={0}>
        {"…"}
      </PaginationItem>
      <PaginationItem
        active={currentPageNum > 1}
        offset={(currentPageNum - 2) * ITEM_LIMIT}
      >
        {currentPageNum - 1}
      </PaginationItem>
      <PaginationItem
        active={currentPageNum > 0}
        offset={(currentPageNum - 1) * ITEM_LIMIT}
      >
        {currentPageNum + 0}
      </PaginationItem>
      <Button as="div" colorScheme="blue" borderRadius="20px" maxWidth="40px">
        {currentPageNum + 1}
      </Button>
      <PaginationItem
        active={currentPageNum < endPageNum}
        offset={(currentPageNum + 1) * ITEM_LIMIT}
      >
        {currentPageNum + 2}
      </PaginationItem>
      <PaginationItem
        active={currentPageNum < endPageNum - 1}
        offset={(currentPageNum + 2) * ITEM_LIMIT}
      >
        {currentPageNum + 3}
      </PaginationItem>
      <PaginationItem
        active={currentPageNum < endPageNum - 3}
        offset={endPageNum * ITEM_LIMIT}
      >
        {"…"}
      </PaginationItem>
      <PaginationItem
        active={currentPageNum < endPageNum - 2}
        offset={endPageNum * ITEM_LIMIT}
      >
        {endPageNum + 1}
      </PaginationItem>
    </Flex>
  );
};

export default Pagination;
