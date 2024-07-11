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
                }

                if (currentEmergency?.responder) {
                    const userId = currentEmergency.responder;
                    const userResponse = await dispatch(fetchUser({ userId })).unwrap();
                    setRespondent(userResponse);
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <TopBar />
            <h1>Emergency Details</h1>
            {currentEmergency && currentUserLocation && (
                <div>
                    <UserGPSNavigation
                        userRole={currentUser?.roles}
                        userLatitude={currentUserLocation.latitude.toString()}
                        userLongitude={currentUserLocation.longitude.toString()}
                        emergencyLatitude={currentEmergency.latitude}
                        emergencyLongitude={currentEmergency.longitude}
                        responderLatitude={currentEmergency?.responderLatitude}
                        responderLongitude={currentEmergency?.responderLongitude}
                    />
                    <p><strong>Type of Emergency:</strong> {currentEmergency.title}</p>
                    <p><strong>Condition of the People:</strong> {currentEmergency.condition}</p>
                    <p><strong>Description:</strong> {currentEmergency.description}</p>
                    <p><strong>Location:</strong> {currentEmergency.place}</p>
                    <p><strong>Latitude:</strong> {currentEmergency.latitude}</p>
                    <p><strong>Longitude:</strong> {currentEmergency.longitude}</p>
                    <p><strong>Status:</strong> {currentEmergency.status}</p>
                </div>
            )}
            {respondent && (
                <div>
                    <p><strong>Responder:</strong> {respondent.username}</p>
                    <p><strong>Responder Email:</strong> {respondent.email}</p>
                    <p><strong>Responder Phone:</strong> {respondent.phoneNumber}</p>
                </div>
            )}
        </div>
    );
};

export default EmergencyDetailsPage;
