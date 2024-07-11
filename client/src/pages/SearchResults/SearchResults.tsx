import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { User } from '../../models/User';
import TopBar from '../../components/topbar/TopBar';
import "./SearchResults.css"

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
            <TopBar />
            <h1 className='search-result-header'>Search Results</h1>
            <h2 className='search-result-length'>{results.length} results found</h2>
            {results.length ? (
                <ul>
                    {results.map((user) => (
                        <li className='search-result-list' key={user._id}>
                            <p className='search-result-content'>Username: {user.username}</p>
                            <p className='search-result-content'>Email: {user.email}</p>
                            <p className='search-result-content'>Phone Number: {user.phoneNumber}</p>
                            <p className='search-result-content'>Address: {user.address}</p>
                            <p className='search-result-content'>Medical History: {user.medicalHistory}</p>
                            <p className='search-result-content'>Current Medication: {user.currentMedication}</p>
                            <p className='search-result-content'>Vaccination: {user.vaccination}</p>
                            <p className='search-result-content'>Emergency Contact Name: {user.emergencyContactName}</p>
                            <p className='search-result-content'>Relationship: {user.relationship}</p>
                            <p className='search-result-content'>Emergency Contact Number: {user.emergencyContactNumber}</p>
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
