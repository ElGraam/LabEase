import HeaderActionMenu from '@/components/HeaderActionMenu';
import { Box, Flex, Image, Link, SystemStyleObject } from '@chakra-ui/react';
import NextLink from 'next/link';

const Header = async () => {
  const bgStyle: SystemStyleObject = {
    position: 'sticky',
    top: '0',
    zIndex: 'sticky',
    backgroundColor: '#FFFFFF',
    width: '100%',
    boxShadow: 'base',
  };

  const boxStyle: SystemStyleObject = {
    maxWidth: '1140px',
    padding: '0 20px',
    margin: '0 auto',
  };

  const contentFlexStyle: SystemStyleObject = {
    backgroundColor: 'white',
    width: '100%',
    height: '64px',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const logoStyle: SystemStyleObject = {
    maxWidth: { base: '221px', md: 'unset' },
  };

  const logoImageStyle: SystemStyleObject = {
    height: '40px'
  }

  return (
    <Box as='header' sx={bgStyle}>
      <Box sx={boxStyle}>
        <Flex sx={contentFlexStyle}>
          <Link as={NextLink} href='/' sx={logoStyle}>
            <Image src='/univ-logo.png' alt='' sx={logoImageStyle} />
          </Link>
          <HeaderActionMenu />
        </Flex>
      </Box>
    </Box>
  );
};

export default Header;
