import React from 'react';
import { Box, Flex, IconButton, useBreakpointValue } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
    const display = useBreakpointValue({ base: 'block', md: 'none' });
    const location = useLocation();

    const isCurrentPath = (path: string) => location.pathname === path;

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
                <Link to="/" style={{ color: isCurrentPath("/") ? "#9747FF" : undefined, pointerEvents: isCurrentPath("/") ? "none" : undefined }}>
                    <IconButton
                        variant="ghost"
                        colorScheme="black"
                        aria-label="Home"
                        icon={<i className="fa-solid fa-house"></i>}
                    />
                </Link>
                <Link to="/alerts" style={{ color: isCurrentPath("/alerts") ? "#9747FF" : undefined, pointerEvents: isCurrentPath("/alerts") ? "none" : undefined }}>
                    <IconButton
                        variant="ghost"
                        colorScheme="black"
                        aria-label="Alert"
                        icon={<i className="fa-solid fa-bullhorn"></i>}
                    />
                </Link>
                <Link to="/records" style={{ color: isCurrentPath("/records") ? "#9747FF" : undefined, pointerEvents: isCurrentPath("/records") ? "none" : undefined }}>
                    <IconButton
                        variant="ghost"
                        colorScheme="black"
                        aria-label="Records"
                        icon={<i className="fa fa-book"></i>}
                    />
                </Link>
                <Link to="/settings" style={{ color: isCurrentPath("/settings") ? "#9747FF" : undefined, pointerEvents: isCurrentPath("/settings") ? "none" : undefined }}>
                    <IconButton
                        variant="ghost"
                        colorScheme="black"
                        aria-label="Contact"
                        icon={<i className="fa fa-user"></i>}
                    />
                </Link>
            </Flex>
        </Box>
    );
};

export default Footer;
