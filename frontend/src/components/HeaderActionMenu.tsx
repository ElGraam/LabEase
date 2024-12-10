'use client';

import {
  Button,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SystemStyleObject,
  chakra,
} from '@chakra-ui/react';
import { signOut, useSession } from 'next-auth/react';
import { FaSignOutAlt, FaPlus } from 'react-icons/fa';
import NextLink from 'next/link';

const ChakraFaSignOutAlt = chakra(FaSignOutAlt);
const ChakraFaPlus = chakra(FaPlus);

const HeaderActionMenu = () => {
  const { data: session, status: status } = useSession();

  // 全体のスタイル
  const contentFlexStyle: SystemStyleObject = {
    gap: '16px',
    alignItems: 'center',
  };

  const IconStyle: SystemStyleObject = {
    width: '40px',
    height: '40px',
    objectFit: 'cover',
    borderRadius: 'full',
    border: '2px solid',
    borderColor: 'gray.200',
  };

  const menuListStyle: SystemStyleObject = {
    mt: '12px',
    py: '0',
    borderRadius: 'md',
    boxShadow: 'lg',
    overflow: 'hidden',
    minW: '200px',
  };

  const menuItemStyle: SystemStyleObject = {
    py: '12px',
    px: '16px',
    fontWeight: 'medium',
    fontSize: '16px',
    color: 'gray.700',
    _hover: {
      bg: 'gray.100',
    },
  };

  const menuItemIconStyle: SystemStyleObject = {
    mr: '12px',
    w: '20px',
    h: '20px',
    color: 'gray.600',
  };

  const labAddButtonStyle: SystemStyleObject = {
    display: 'flex',
    alignItems: 'center',
    height: '40px',
    fontSize: '16px',
    fontWeight: 'medium',
    px: '16px',
    borderRadius: 'md',
    bg: 'blue.500',
    color: 'white',
    _hover: {
      bg: 'blue.600',
    },
  };

  // ログインボタンのスタイル
  const logInButtonStyle: SystemStyleObject = {
    color: 'blue.500',
    fontSize: '16px',
    fontWeight: 'medium',
    _hover: {
      textDecoration: 'underline',
    },
  };

  // ログアウトを押された時の処理
  const handleLogOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex sx={contentFlexStyle}>
      {status === 'authenticated' && (
        <>
          <Button
            as={NextLink}
            href='/lab'
            sx={labAddButtonStyle}
            variant='solid'
            leftIcon={<ChakraFaPlus />}
          >
            研究室
          </Button>
          <Menu autoSelect={false}>
            <MenuButton>
              <Image
                src={'/sample/profile-icon-sample.png'}
                alt='プロフィール画像'
                sx={IconStyle}
              />
            </MenuButton>
            <MenuList sx={menuListStyle}>
              <MenuItem onClick={handleLogOut} sx={menuItemStyle}>
                <ChakraFaSignOutAlt sx={menuItemIconStyle} />
                ログアウト
              </MenuItem>
            </MenuList>
          </Menu>
        </>
      )}
      {status === 'unauthenticated' && (
        <Button as={NextLink} href='/auth/signin' variant='link' sx={logInButtonStyle}>
          ログイン
        </Button>
      )}
    </Flex>
  );
};

export default HeaderActionMenu;
