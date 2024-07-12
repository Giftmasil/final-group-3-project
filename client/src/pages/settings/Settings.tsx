import "./Settings.css";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../redux/ReduxStore";
import { updateUser } from "../../redux/slices/UserSlice";
import { User } from "../../models/User";
import TopBar from "../../components/topbar/TopBar";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
  useToast,
  Heading,
  Spinner,
  Center,
  Image
} from "@chakra-ui/react";
import Footer from "../../components/footer/Footer";

const Settings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [updatedUser, setUpdatedUser] = useState<User | null>(null);
  const [password, setPassword] = useState<string>("");
  const dispatch: AppDispatch = useDispatch();
  const toast = useToast()

  useEffect(() => {
    if (user) {
      setUpdatedUser(user);
    }
  }, [user]);

  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({
      ...prevUser!,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!updatedUser) {
      toast({
        title: "Error",
        description: "User not found",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom"
      })
      return;
    }

    const userData = { ...updatedUser, password: password ? password : undefined };
    dispatch(updateUser(userData));
    toast({
      title: "Success",
      description: "Profile updated successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "bottom"
    })
  };

  if (!user) {
    return (
    <Spinner
    thickness='4px'
    speed='0.65s'
    emptyColor='gray.200'
    color='blue.500'
    size='xxl'
    />)
  }

  console.log(user);

  return (
    <Box >
      <TopBar />
     
      <Flex justify="center">
        <Box width={{base:"100%", md:"80%", lg:"60%"}} p={8} borderWidth={1} borderRadius= "lg" boxShadow="large">
        <Center><Image src={user.profileUrl || "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=1024x1024&w=is&k=20&c=oGqYHhfkz_ifeE6-dID6aM7bLz38C6vQTy1YcbgZfx8="} alt="Profile" title="profile" boxSize="150px" objectFit= "cover" borderRadius= "full" style={{display: "block", margin: "0 auto"}} />
        </Center>
        <Heading as='h2' size='lg' mb={6} textAlign="center">Edit Profile</Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing={6}>
          <FormControl>
        <FormLabel>ProfileUrl:</FormLabel>
          <Input
            type="text"
            name="profileUrl"
            defaultValue={user.profileUrl}
            placeholder="enter image url here"
            onChange={handleInputChange}
          />
          </FormControl>

          <FormControl>
        <FormLabel> Username:  </FormLabel>
          <Input
            type="text"
            name="username"
            placeholder="John Doe"
            defaultValue={user.username}
            onChange={handleInputChange}
          />
          </FormControl>

        <FormControl>
        <FormLabel>Email:</FormLabel>
          <Input
            type="email"
            name="email"
            defaultValue={user.email}
            placeholder="example@gmail.com"
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl>
        <FormLabel>Password:</FormLabel>
          <Input
            type="text"
            name="password"
            placeholder="your password"
            onChange={handlePasswordChange}
          />
        </FormControl>
        <FormControl>
        <FormLabel>Phone Number: </FormLabel>
          <Input
            type="text"
            name="phoneNumber"
            placeholder="555-555-5555"
            defaultValue={user.phoneNumber.toString()}
            onChange={handleInputChange}
          />
          </FormControl>

        <FormControl>
        <FormLabel>Age:</FormLabel>
          <Input
            type="number"
            name="age"
            placeholder="20"
            defaultValue={user.age?.toString()}
            onChange={handleInputChange}
          />
          </FormControl>
        
       <FormControl> 
        <FormLabel> Address:</FormLabel>
          <Input
            type="text"
            name="address"
            placeholder="5120-02000"
            defaultValue={user.address}
            onChange={handleInputChange}
          />
          </FormControl>
          
       <FormControl> <FormLabel>
          Medical History:</FormLabel>
          <Textarea
            name="medicalHistory"
            defaultValue={user.medicalHistory}
            placeholder="hypertention, asthma"
            onChange={handleInputChange}
          />
          </FormControl>
    
       <FormControl> <FormLabel>
          Current Medication:</FormLabel>
          <Input
            type="text"
            name="currentMedication"
            placeholder="morphine"
            defaultValue={user.currentMedication}
            onChange={handleInputChange}
          />
          </FormControl>
      
       <FormControl> <FormLabel>
          Vaccination:</FormLabel>
          <Input
            type="text"
            name="vaccination"
            placeholder="polio, tetanus"
            defaultValue={user.vaccination}
            onChange={handleInputChange}
          />
          </FormControl>
      
       <FormControl> <FormLabel>
          Emergency Contact Name:</FormLabel>
          <Input
            type="text"
            name="emergencyContactName"
            placeholder="John Doe"
            defaultValue={user.emergencyContactName}
            onChange={handleInputChange}
          />
          </FormControl>

       <FormControl> <FormLabel>
          Relationship:</FormLabel>
          <Input
            type="text"
            name="relationship"
            placeholder="Brother"
            defaultValue={user.relationship}
            onChange={handleInputChange}
          />
          </FormControl>

       <FormControl> <FormLabel>
          Emergency Contact Number:</FormLabel>
          <Input
            type="text"
            name="emergencyContactNumber"
            placeholder="555-555-5555"
            defaultValue={user.emergencyContactNumber?.toString()}
            onChange={handleInputChange}
          />
          </FormControl>
          
       <FormControl> <Button type="submit" colorScheme="teal" size="md">
            Save
          </Button>
          </FormControl>
        </Stack>
      </form>
      </Box>
      </Flex>
      <Footer />
    </Box>
  );
};

export default Settings;
