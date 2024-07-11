import "./Register.css";
import React, { useRef, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useBreakpointValue,
  Flex,
  Image,
  InputGroup,
  InputRightElement,
  useToast
} from "@chakra-ui/react";
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/slices/AuthenticationSlice';
import { AppDispatch, RootState } from '../../redux/ReduxStore';

const Register: React.FC = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const dispatch: AppDispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.authentication);
  const [show, setShow] = React.useState(false);
  const handleShow = () => setShow(!show);
  const toast = useToast();

  const handleRegisterUser = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (
      !usernameRef.current?.value ||
      !emailRef.current?.value ||
      !phoneNumberRef.current?.value ||
      !passwordRef.current?.value ||
      !confirmPasswordRef.current?.value
    ) {
      toast({
        title: "Empty Fields",
        description: "Please fill in all the fields.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      toast({
        title: "Passwords do not match",
        description: "Please enter the same password in both fields.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    dispatch(registerUser({
      username: usernameRef.current.value,
      email: emailRef.current.value,
      phoneNumber: parseInt(phoneNumberRef.current.value, 10),
      password: passwordRef.current.value,
    }));
  };

  useEffect(() => {
    if (auth.success) {
      toast({
        title: 'Registration Successful',
        description: 'You have successfully registered.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } else if (auth.error) {
      toast({
        title: 'Registration Failed',
        description: 'An unexpected error occurred. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [auth, toast]);

  const handleBackToLogin = () => {
    window.location.href = "/login";
  }

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
            <Input type="email" placeholder="angie@gmail.com" variant="outline" ref={emailRef} />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Username</FormLabel>
            <Input type="text" placeholder="angela" variant="outline" ref={usernameRef} />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Password</FormLabel>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type={show ? 'text' : 'password'}
                placeholder="Enter password"
                ref={passwordRef}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleShow}>
                  {show ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Confirm password</FormLabel>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type={show ? 'text' : 'password'}
                placeholder="Enter password"
                ref={confirmPasswordRef}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleShow}>
                  {show ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Phone Number</FormLabel>
            <Input type="text" placeholder="Your phone number" variant="outline" ref={phoneNumberRef} />
          </FormControl>

          <Button onClick={handleRegisterUser} width="full" mt={4} colorScheme="purple">
            Sign Up
          </Button>
          <Button onClick={handleBackToLogin} width="full" mt={4} colorScheme="purple">
            Back To Login
          </Button>
        </form>
      </Box>
      <Box flex="1" display={displayImage}>
        <Image
          src="https://plus.unsplash.com/premium_vector-1712873279566-379ba42df159?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Illustration"
          boxSize="100%"
          objectFit="cover"
        />
      </Box>
    </Flex>
  );
};

export default Register;
