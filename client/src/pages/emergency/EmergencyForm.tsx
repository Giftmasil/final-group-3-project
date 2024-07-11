import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './EmergencyForm.css';
import { AppDispatch, RootState } from '../../redux/ReduxStore';
import { createEmergency } from '../../redux/slices/EmergencySlice';
import { Emergency } from '../../models/Emergency';
import { useNavigate } from 'react-router-dom';
import { Select, Flex, Box, Stack, FormControl, FormLabel, Button, useBreakpointValue, Input, Heading, useToast } from '@chakra-ui/react';

const EmergencyForm: React.FC = () => {

    const [typeOfEmergency, setTypeOfEmergency] = useState<string>('fire');
    const [conditionOfThePeople, setConditionOfThePeople] = useState<string>('BleedingButContious');
    const [description, setDescription] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const navigate = useNavigate();
    const toast = useToast(); 

    const dispatch = useDispatch<AppDispatch>();
    const { loading, success, error } = useSelector((state: RootState) => state.emergency);
    const { user } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async function (position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                setLatitude(lat);
                setLongitude(lon);

                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
                    const data = await response.json();
                    const placeName = data.display_name || "Unknown location";
                    setLocation(placeName);
                } catch (error) {
                    console.error('Error fetching location:', error);
                }
            }, showError);
        } else {
            alert("Geolocation is not supported by this browser.");
        }

        function showError(error: GeolocationPositionError) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    alert("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    alert("The request to get user location timed out.");
                    break;
                default:
                    alert("An unknown error occurred.");
                    break;
            }
        }
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();

        console.log(user?._id);
        

        if (latitude === null || longitude === null) {
            alert('Geolocation is required to submit an emergency.');
            return;
        }

        const emergencyData: Emergency = {
            title: typeOfEmergency,
            description,
            place: location,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            user: user!._id,
            status: "Delivered",
            condition: conditionOfThePeople,
        };

        try {
            const resultAction = await dispatch(createEmergency(emergencyData));
            if (createEmergency.fulfilled.match(resultAction)) {
                const createdEmergency = resultAction.payload;
                if (success) {
                    toast({
                        title: "Success!",
                        description: "Your message has been sent successfully.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                } else if (error) {
                    toast({
                        title: "Error",
                        description: "An unexpected error occurred. Please try again.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                }
                navigate(`/emergency/${createdEmergency._id}`);
            }
        } catch (err) {
            console.error('Failed to dispatch createEmergency:', err);
        }

        setConditionOfThePeople("");
        setDescription("");
        setTypeOfEmergency("");
        setLocation("");
        setLatitude(null);
        setLongitude(null);
    };

    const handleCancel = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        navigate('/');
    }

    const formWidth = useBreakpointValue({ base: "90%", md: "70%", lg: "50%" });


    return (
        <Flex align="center" justify="center" direction={{ base: "column", md: "row" }} p={4}>
            <Box
                my={8}
                mx={{ base: 0, md: 4 }}
                textAlign="left"
                width={formWidth}
                p={8}
                borderRadius="lg"
                overflow="hidden"
                bg="white"
                borderWidth={1}
                boxShadow="lg"
            >
                <Heading as="h2" size="lg" mb={6} textAlign="center">
                    Quick Assessment
                </Heading>
                <form>
                    <Stack spacing={6} direction = "column">
                    <FormControl id="condition">
                            <FormLabel>Type of Emergenct</FormLabel>
                            <Select 
                            placeholder="Select emergency"
                            value={typeOfEmergency}
                    onChange={(e) => setTypeOfEmergency(e.target.value)}
                            >
                                <option value="Road Accident">Road Accident</option>
                                <option value="Medical Issue">Medical Issue</option>
                                <option value="Fire">Fire</option>
                            </Select>
                        </FormControl>

                        <FormControl id="condition">
                            <FormLabel>Condition of the People</FormLabel>
                            <Select 
                            placeholder="Select answer"
                            value={conditionOfThePeople}
                            onChange={(e) => setConditionOfThePeople(e.target.value)}
                            >
                                <option value="Unconscious">Unconscious</option>
                                <option value="Bleeding">Bleeding</option>
                                <option value="Moderate">Moderate</option>
                            </Select>
                        </FormControl>

                        <FormControl id="description">
                            <FormLabel>Briefly Describe What You Saw</FormLabel>
                            <Input 
                            placeholder='Briefly describe what you saw' 
                            variant="outline" size="md" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}/>
                        </FormControl>
                        
                        <FormControl id="location">
                            <FormLabel>Location</FormLabel>
                            <Input 
                            placeholder='Location' 
                            variant="outline" size="md" 
                            value={location}
                            readOnly/>
                        </FormControl>
                    </Stack>
                    
                    <Stack spacing={4} direction="row" mt={6} align="center">
                        <Button colorScheme="purple" variant="solid" isLoading={loading} onClick= {handleSubmit}>
                            Submit
                        </Button>
                        <Button onClick={handleCancel} colorScheme="purple" variant="outline">
                            Cancel
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Flex>
    );
};

export default EmergencyForm;


