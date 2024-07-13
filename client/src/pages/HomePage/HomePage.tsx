import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/ReduxStore';
import "./HomePage.css";
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
    Input, 
    Heading, 
    useToast
} from '@chakra-ui/react';
import Footer from '../../components/footer/Footer';
import axios from 'axios';
import Typewriter from '../../components/TypeWriter';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    const loggedInUser = useSelector((state: RootState) => state.user.user);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = useRef(null);
    const chatbotRef = useRef<HTMLInputElement>(null);
    const [aiResponse, setAiResponse] = useState<string>("");
    const [userInput, setUserInput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false)
    const toast = useToast()

    const handleAskAi = async () => {
        try {
            if (!userInput) return;
            setLoading(true);
            const response = await axios.post("https://chat-bot-group-3.onrender.com/get_advice", { query: userInput });
            setAiResponse(response.data.response.trim());
            setLoading(false)
        } catch (error) {
            toast({
                title: "Error",
                description: "There was an error fetching the response. Please try again later.",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
            setAiResponse("There was an error fetching the response.");
            setLoading(false)
        }
    }

    const clearUserInput = () => {
        setAiResponse("")
        setUserInput("");
    }

    useEffect(() => {
        // Fetch other user details if available
    }, [loggedInUser]);

    if (!loggedInUser) {
        return <p>You are not logged in. Please log in to view your details.</p>;
    }

    return (
        <div>
            <TopBar />
            <Box textAlign="center" p={4}>
                <Heading as="h1" size="xl" mt={2} mb={6}>
                    Q-response is an emergency response app designed to quickly assess and report emergencies
                </Heading>
                <Link to="/emergency">
                <Button mt={2} className='emergency-button' colorScheme='red'>
                    <i className="fa-solid fa-bullhorn"></i> Emergency
                </Button>
                </Link>
            </Box>
            <Flex p={5} direction={{ base: 'column', md: 'row' }} alignItems="center" justifyContent="center" mt={8} mx="auto" mb={10}>
                <Image w={{ base: '100%', md: '50%' }} src="https://plus.unsplash.com/premium_vector-1682310717908-db9ed503a9c3?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="first aid kit" borderRadius="10px" mb={{ base: 4, md: 0 }} />
                <Flex direction="column" ml={{ base: 0, md: 4 }} textAlign={{ base: 'center', md: 'left' }}>
                    <Heading as="h2" size="lg" mb={4}>
                        What are your thoughts on being prepared in case of an emergency? It's time to level up your skills.
                    </Heading>
                    <Flex alignItems="center" mt={4}>
                        <Button variant="ghost" ref={btnRef} onClick={onOpen}>
                            <Image boxSize='50px' objectFit='cover' borderRadius='full' src="https://plus.unsplash.com/premium_vector-1712873279566-379ba42df159?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="learn first aid" />
                        </Button>
                        <Text ml={2}>Learn first aid with AI</Text>
                    </Flex>
                    <Drawer isOpen={isOpen} placement='right' onClose={
                        ()=> {
                        clearUserInput()
                        onClose()
                        }} finalFocusRef={btnRef}>
                        <DrawerOverlay />
                        <DrawerContent>
                            <DrawerCloseButton />
                            <DrawerHeader>Ask the AI</DrawerHeader>
                            <DrawerBody>
                                <Input 
                                    ref={chatbotRef} 
                                    placeholder='Type here...' 
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                />
                                {aiResponse && <Typewriter text={aiResponse} />}
                            </DrawerBody>
                            <DrawerFooter>
                                <Button variant='outline' mr={3} onClick={
                                    ()=>{
                                    clearUserInput()
                                    onClose()
                                    }}>Cancel</Button>
                                <Button colorScheme='blue' isLoading={loading} onClick={handleAskAi}>Ask</Button>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </Flex>
            </Flex>
            <Footer />
        </div>
    );
};

export default Home;
