import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './EmergencyForm.css';
import { AppDispatch, RootState } from '../../redux/ReduxStore';
import { createEmergency } from '../../redux/slices/EmergencySlice';
import { Emergency } from '../../models/Emergency';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/topbar/TopBar';

const EmergencyForm: React.FC = () => {
    const [typeOfEmergency, setTypeOfEmergency] = useState<string>('fire');
    const [conditionOfThePeople, setConditionOfThePeople] = useState<string>('BleedingButContious');
    const [description, setDescription] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const navigate = useNavigate();

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

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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

    return (
        <div>
            <TopBar />
            <h1>Quick assessment</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="typeOfEmergency">Type Of Emergency</label>
                <select
                    name="typeOfEmergency"
                    id="typeOfEmergency"
                    value={typeOfEmergency}
                    onChange={(e) => setTypeOfEmergency(e.target.value)}
                >
                    <option value="fire">Fire</option>
                    <option value="earthquake">Earthquake</option>
                    <option value="roadaccident">Road Accident</option>
                    <option value="other">Other</option>
                </select>
                <label htmlFor="conditionOfThePeople">Condition Of the People</label>
                <select
                    name="conditionOfThePeople"
                    id="conditionOfThePeople"
                    value={conditionOfThePeople}
                    onChange={(e) => setConditionOfThePeople(e.target.value)}
                >
                    <option value="Bleeding but conscious">Bleeding but conscious</option>
                    <option value="Unconscious">Unconscious</option>
                    <option value="Sick">Sick</option>
                    <option value="Other">Other</option>
                </select>
                <label htmlFor="Description">Brief Description</label>
                <textarea
                    name="Description"
                    id="Description"
                    cols={30}
                    rows={10}
                    placeholder="Brief summary of what you saw"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <label htmlFor="location">Location</label>
                <input
                    type="text"
                    name="location"
                    id="location"
                    placeholder="Location"
                    value={location}
                    readOnly
                />
                <button type="submit" disabled={loading}>Submit</button>
                <button type="reset">Cancel</button>
            </form>
            {error && <p>Error, please try again</p>}
            {success && <p>Success, request sent successfully</p>}
        </div>
    );
};

export default EmergencyForm;
