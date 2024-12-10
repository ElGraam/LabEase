import { FOOTER_FOOT_LINKS, FOOTER_LINKS } from '@/const';
import { Box, Center, Heading, Image, Link, SystemStyleObject, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react';

const Footer = () => {
  const bgStyle: SystemStyleObject = {
    paddingX: { base: '20px', md: 'none' },
    paddingY: '32px',
    backgroundColor: 'gray.50',
  };

  const boxStyle: SystemStyleObject = {
    maxWidth: '1140px',
    padding: '0 20px',
    margin: '0 auto',
  };

  const titleStyle: SystemStyleObject = {
    fontSize: '16px',
  };

  const logoBoxStyle: SystemStyleObject = {
    display: { base: 'block', md: 'flex' },
    gap: '24px',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    position: 'relative',
    zIndex: '0',
  };

  const linkListsBoxStyle: SystemStyleObject = {
    marginTop: '32px',
  };

  const linkListBoxStyle: SystemStyleObject = {
    marginBottom: '16px',
  };

  const linksBoxStyle: SystemStyleObject = {
    marginTop: '8px',
  };

  const corpInfoBoxStyle: SystemStyleObject = {
    gap: '0px',
    paddingY: '8px',
  };

  return (
    <Box as='footer' sx={bgStyle}>
      <Box sx={boxStyle}>
        <VStack sx={corpInfoBoxStyle}>
          <Box sx={logoBoxStyle}>
            <Image src={'/univ-logo.png'} alt='univ-logo' sx={{ maxWidth: '80px', height: 'auto' }} />            
            <Heading as='h3' sx={titleStyle}>
              大学のサービス
            </Heading>
          </Box>
          <Box sx={linkListsBoxStyle}>
            {FOOTER_LINKS.map(({ title, value }, i) => (
              <Box key={i} sx={linkListBoxStyle}>
                <Heading as='h5' sx={titleStyle}>
                  {title}
                </Heading>
                <Wrap spacingX='16px' spacingY='unset' sx={linksBoxStyle}>
                  {value.map(({ text, link }, i) => (
                    <WrapItem key={i}>
                      <Link target='_blank' href={link}>
                        {text}
                      </Link>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
            ))}
          </Box>
          <Wrap spacingX='16px' spacingY='unset'>
            {FOOTER_FOOT_LINKS.map(({ text, link }, i) => (
              <WrapItem key={i}>
                <Center>
                  <Link target='_blank' href={link}>
                    {text}
                  </Link>
                </Center>
              </WrapItem>
            ))}
          </Wrap>
          <Text>Copyright © 2024 UOA</Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Footer;
