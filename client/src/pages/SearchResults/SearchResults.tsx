import React, { useEffect, useState } from 'react';
import './SearchResults.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { User } from '../../models/User';

const SearchResults: React.FC = () => {
    const [results, setResults] = useState<User[]>([]);
    const location = useLocation();
    
    const query = new URLSearchParams(location.search).get('query');

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (query) {
                try {
                    const response = await axios.get(`http://localhost:3500/users/search?query=${query}`);
                    setResults(response.data);
                } catch (error) {
                    console.error('Error fetching search results:', error);
                }
            }
        };

        fetchSearchResults();
    }, [query]);

    return (
        <div className="search-results">
            <h2>Search Results</h2>
            {results.length ? (
                <ul>
                    {results.map((user) => (
                        <li key={user._id}>
                            <p>Username: {user.username}</p>
                            <p>Email: {user.email}</p>
                            <p>Phone Number: {user.phoneNumber}</p>
                            <p>Address: {user.address}</p>
                            <p>Medical History: {user.medicalHistory}</p>
                            <p>Current Medication: {user.currentMedication}</p>
                            <p>Vaccination: {user.vaccination}</p>
                            <p>Emergency Contact Name: {user.emergencyContactName}</p>
                            <p>Relationship: {user.relationship}</p>
                            <p>Emergency Contact Number: {user.emergencyContactNumber}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No results found</p>
            )}
        </div>
    );
};

export default SearchResults;
