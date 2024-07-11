import "./EmergencyDetailsPage.css";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch } from '../../redux/ReduxStore';
import { fetchSingleEmergency } from '../../redux/slices/EmergencySlice';
import UserGPSNavigation from "../../components/userGpsNavigation/UserGPSNavigation";
import { fetchUser } from "../../redux/slices/UserSlice";
import TopBar from "../../components/topbar/TopBar";
import { Emergency } from "../../models/Emergency";
import { User } from "../../models/User";
import { RootState } from '../../redux/ReduxStore';
import { 
    Spinner, 
    Box,
    Heading,
    Text,
    Stack,
} from '@chakra-ui/react'
import Footer from "../../components/footer/Footer";


const EmergencyDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [respondent, setRespondent] = useState<User | undefined>(undefined);
    const [currentEmergency, setCurrentEmergency] = useState<Emergency | undefined>(undefined);
    const [currentUserLocation, setCurrentUserLocation] = useState<GeolocationCoordinates | null>(null);
    const currentUser = useSelector((state: RootState) => state.user.user);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (id) {
                    const response = await dispatch(fetchSingleEmergency(id)).unwrap();
                    setCurrentEmergency(response);

                    if (response.responder) {
                        const userResponse = await dispatch(fetchUser({ userId: response.responder })).unwrap();
                        setRespondent(userResponse);
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching emergency details:', error);
                setError('Error loading emergency details');
                setLoading(false);
            }
        };

        fetchData();
    }, [id, dispatch]);

    useEffect(() => {
        // Function to fetch current user's location
        const fetchCurrentLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setCurrentUserLocation(position.coords);
                    },
                    (error) => {
                        console.error('Error getting current location:', error);
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        };

        fetchCurrentLocation();
    }, []);

    if (loading) return (
        <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='blue.500'
        size='xl'
        />
    )
    
    if (error) return <p>{error}</p>;

    return (
        <div>
            <TopBar />
            <Box  maxW="1000px" mx="auto" mt={4}>
            <Heading as="h2" textAlign="center"     mt = {1} mb={4}className="emergency-details-header">Emergency Details</Heading>
            {currentEmergency && currentUserLocation && (
                <Box className="emergency-page-detals-container" borderWidth={1} borderRadius="lg" p={4} mb={4} boxShadow="lg">
                    <UserGPSNavigation
                        userRole={currentUser?.roles}
                        userLatitude={currentUserLocation.latitude.toString()}
                        userLongitude={currentUserLocation.longitude.toString()}
                        emergencyLatitude={currentEmergency.latitude.toString()}
                        emergencyLongitude={currentEmergency.longitude.toString()}
                        responderLatitude={currentEmergency?.responderLatitude?.toString()}
                        responderLongitude={currentEmergency?.responderLongitude?.toString()}
                    />
                    <Stack spacing={4} align="left" p={4}>
                    <Text className="emergency-details-info"><strong>Type of Emergency:</strong> {currentEmergency.title}</Text>
                    <Text className="emergency-details-info"><strong>Condition of the People:</strong> {currentEmergency.condition}</Text>
                    <Text className="emergency-details-info"><strong>Description:</strong> {currentEmergency.description}</Text>
                    <Text className="emergency-details-info"><strong>Location:</strong> {currentEmergency.place}</Text>
                    <Text className="emergency-details-info"><strong>Latitude:</strong> {currentEmergency.latitude}</Text>
                    <Text className="emergency-details-info"><strong>Longitude:</strong> {currentEmergency.longitude}</Text>
                    <Text className="emergency-details-info"><strong>Status:</strong> {currentEmergency.status}</Text>
                    </Stack>
                </Box>
            )}
            {respondent && (
                <Box className="emergency-page-detals-container" borderWidth={1} borderRadius="large" p={4} boxShadow="lg" >
                    <Stack spacing={4}>
                    <Text className="responder-details-info"><strong>Responder:</strong> {respondent.username}</Text>
                    <Text className="responder-details-info"><strong>Responder Email:</strong> {respondent.email}</Text>
                    <Text className="responder-details-info"><strong>Responder Phone:</strong> {respondent.phoneNumber}</Text>
                    </Stack>
                </Box>
            )}
            </Box>
            <Footer />
        </div>
    );
};

export default EmergencyDetailsPage;


