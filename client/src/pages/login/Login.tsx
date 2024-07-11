import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slices/AuthenticationSlice';
import { AppDispatch, RootState } from '../../redux/ReduxStore';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Box,
  Flex,
  Image,
  useBreakpointValue,
  useToast,
  InputGroup,
  InputRightElement
} from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import "./Login.css";

const Login: React.FC = () => {
  const toast = useToast();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const dispatch: AppDispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.authentication);
  const navigate = useNavigate();
  const [show, setShow] = React.useState(false);
  const handleShow = () => setShow(!show);

  const handleLoginUser = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!emailRef.current || !passwordRef.current) {
      toast({
        title: "Empty Fields",
        description: "Please fill in both email and password fields.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(emailRef.current.value)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await dispatch(loginUser({
        email: emailRef.current.value,
        password: passwordRef.current.value,
      })).unwrap();

      if (auth.success) {
        toast({
          title: 'Login Successful',
          description: 'You have successfully logged in.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/');
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSignUpRoute = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate("/register");
  };

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
        <Stack spacing={4} direction="column">
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              placeholder="angela@gmail.com"
              _focus={{ outline: "none" }}
              bg="transparent"
              ref={emailRef}
            />
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

          <Stack spacing={4} direction="column">
            <Button onClick={handleLoginUser} isLoading={auth.loading} colorScheme="purple" variant="solid" width="full">
              Login
            </Button>
            <Box textAlign="left">
              <p>Are you new here?</p>
              <Button onClick={handleSignUpRoute} colorScheme="purple" variant="solid" width="full">
                Signup
              </Button>
            </Box>
          </Stack>
        </Stack>
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

export default Login;
