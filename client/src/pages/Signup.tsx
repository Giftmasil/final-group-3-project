import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useBreakpointValue,
  Flex,
  Image
} from "@chakra-ui/react";

const SignupForm: React.FC = () => {
    const formWidth = useBreakpointValue({ base: "100%", md: "50%" }); 
  const displayImage = useBreakpointValue({ base: "none", md: "block" });
  return (
    <Flex align="center" justify="center" direction={{ base: "column", md: "row" }}>
    <Box 
      my={8}
      mx={{ base: 0, md: 4 }}
      textAlign="left"
      width={formWidth}
      p={8}
      borderRadius="lg"
      
      overflow="hidden" 
      bg="white" 
      borderWidth={0} 
      mb={{ base: 8, md: 0 }}
    >
      <form>
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input type="email" placeholder="angie@gmail.com" variant="unstyled"/>
        </FormControl>

        <FormControl mt={4}>
          <FormLabel>Username</FormLabel>
          <Input type="text" placeholder="angela" variant='unstyled'/>
        </FormControl>

        <FormControl mt={4}>
          <FormLabel>Password</FormLabel>
          <Input type="password" placeholder="enter your password" variant='unstyled'/>
        </FormControl>

        <FormControl mt={4}>
          <FormLabel>Confirm password</FormLabel>
          <Input type="password" placeholder="confirm your password" variant='unstyled'/>
        </FormControl>

        <Button width="full" mt={4}>
          Sign Up
        </Button>
      </form>
    </Box>
    <Box flex="1" display={displayImage}>
        <Image
          src="https://plus.unsplash.com/premium_vector-1712873279566-379ba42df159?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Illustration"
          boxSize="100%"
          objectFit="cover"
          display={displayImage}
        />
      </Box>
    </Flex>
  );
};

export default SignupForm;
