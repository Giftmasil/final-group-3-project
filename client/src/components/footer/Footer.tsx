import React from 'react';
import { Box, Flex, IconButton, useBreakpointValue } from '@chakra-ui/react';

const Footer: React.FC = () => {
    const display = useBreakpointValue({ base: 'block', md: 'none' });
  return (
    <Box
      as="footer"
      position="fixed"
      bottom={0}
      width="100%"
      bg="white"
      color="black"
      py={2}
      zIndex={1}
      display={display}
    >
      <Flex justify="space-around" align="center">
        <IconButton
          variant="ghost"
          colorScheme="black"
          aria-label="Home"
          icon={<i className="fas fa-home"></i>}
        />
        <IconButton
          variant="ghost"
          colorScheme="black"
          aria-label="Alert"
          icon={<i className="fa fa-bullhorn"></i>}
        />
        <IconButton
          variant="ghost"
          colorScheme="black"
          aria-label="Records"
          icon={<i className="fa fa-book"></i>}
        />
        <IconButton
          variant="ghost"
          colorScheme="black"
          aria-label="Contact"
          icon={<i className="fa fa-user"></i>}
        />
      </Flex>
    </Box>
  );
};

export default Footer;
