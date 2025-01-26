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

  // Manage sort order state
  const [sortOrder, setSortOrder] = useState<string>(
    searchParams?.get("sort") || "studentId",
  );

  const SortMap: { [key: string]: string } = {
    studentId: "studentId",
  };

  /** Process when the search button is pressed */
  const onSubmit = (data: FormData) => {
    const keyword = data.get("keyword") as string;
    const newParams = new URLSearchParams(searchParams?.toString());

    if (keyword) {
      newParams.set("keyword", keyword);
    } else {
      newParams.delete("keyword");
    }

    // Add sort conditions to query parameters
    if (sortOrder) {
      newParams.set("sort", sortOrder);
    }

    newParams.delete("offset");
    router.push(createUrl(pathname, newParams));
  };

  // Process for changing sort options
  const onSortChange = (sort: string) => {
    setSortOrder(sort);
    const newParams = new URLSearchParams(searchParams?.toString());
    newParams.set("sort", sort);
    router.push(createUrl(pathname, newParams));
  };

  // For sp display
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
            placeholder="Search by keyword"
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
                _hover={{ bg: "gray.100" }} // Background color on hover
                _active={{ bg: "gray.200" }} // Background color on click
                rightIcon={<TriangleDownIcon w={3} h={3} />}
                px={4} // Left and right padding of the button
                py={2} // Top and bottom padding of the button
                fontWeight="bold" // Font weight of the button text
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

// For URL generation
const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams,
) => {
  const paramsString = params.toString();
  const queryString = paramsString && `?${paramsString}`;
  return `${pathname}${queryString}`;
};
