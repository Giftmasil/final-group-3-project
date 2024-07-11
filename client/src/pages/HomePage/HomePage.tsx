import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/ReduxStore';
import "./HomePage.css"
import TopBar from '../../components/topbar/TopBar';
import { 
    Button, 
    Flex, 
    Image, 
    Text, 
    Box, 
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Input,} from '@chakra-ui/react';
import Footer from '../../components/footer/Footer';

const Home: React.FC = () => {
    const loggedInUser = useSelector((state: RootState) => state.user.user);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef(null)
  

    useEffect(() => {
        // Fetch other user details if available
    }, [loggedInUser]);

    if (!loggedInUser) {
        return <p>You are not logged in. Please log in to view your details.</p>;
    }

    const toEmergency = () => {
        window.location.href = '/emergency'
    }

    return (
        <div>
            <TopBar />
            <Box textAlign="center"  p={4}>
                <Text fontSize='4xl' mb={4}>
                    Q-response is an emergency response app designed to quickly assess and report emergencies
                </Text>
                <Button fontSize={{base: "small", md: "3xl"}} p={{base: "0.5rem", md: "2rem"}} className='emergency-button' id="emergency" onClick={toEmergency} colorScheme="red" mt={4} w="95%" >
                    <i className="fa-solid fa-bullhorn"></i>Emergency
                </Button>
            </Box>
            <Flex ml={8}p={7}direction={{ base: 'column', md: 'row' }} alignItems="center" justifyContent="center" mt={8} mx="auto" >
                <Image w={{ base: '100%', md: '50%' }} className="placeholder" src="https://plus.unsplash.com/premium_vector-1712873279566-379ba42df159?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"alt="first aid kit" />
                <Flex direction="column" ml={{ base: 0, md: 4 }} textAlign={{ base: 'center', md: 'left' }} mt={{ base: 4, md: 0 }}>
                    <Text fontSize='4xl' mb={4}>
                        What are your thoughts on being prepared in case of an emergency? It's time to level up your
                        skills.
                    </Text>
                    <Flex mb={7} alignItems="center">
                        <>
                            <Button variant="ghost" ref={btnRef} onClick={onOpen} ><Image style={{cursor: "pointer"}} boxSize='50px' objectFit='cover' borderRadius='full' className="ai-icon"  src="https://plus.unsplash.com/premium_vector-1712873279566-379ba42df159?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="learn first aid" /></Button>
                            <Drawer
                                isOpen={isOpen}
                                placement='right'
                                onClose={onClose}
                                finalFocusRef={btnRef}
                            >
                                <DrawerOverlay />
                                <DrawerContent>
                                <DrawerCloseButton />
                                <DrawerHeader>Ask the AI</DrawerHeader>

                                <DrawerBody>
                                    <Input placeholder='Type here...' />
                                    <Text>Ai text</Text>
                                </DrawerBody>

                                <DrawerFooter>
                                    <Button variant='outline' mr={3} onClick={onClose}>
                                    Cancel
                                    </Button>
                                    <Button colorScheme='blue'>Ask</Button>
                                </DrawerFooter>
                                </DrawerContent>
                            </Drawer>
                            </>
                        <Text ml={2}>Learn first aid with AI</Text>
                    </Flex>
                </Flex>
            </Flex>
            <Footer />
        </div>
    );
};

export default Home;