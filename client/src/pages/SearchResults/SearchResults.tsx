import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { User } from '../../models/User';
import TopBar from '../../components/topbar/TopBar';
import "./SearchResults.css"
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/ReduxStore';
import { Heading } from '@chakra-ui/react';
import Footer from '../../components/footer/Footer';

const SearchResults: React.FC = () => {
    const [results, setResults] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false); // Add a loading state
    const location = useLocation();

    const { user } = useSelector((state: RootState) => state.user);

    const query = new URLSearchParams(location.search).get('query');

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (query) {
                setLoading(true); // Set loading to true before fetching
                try {
                    const response = await axios.get(`http://localhost:3500/users/search?query=${query}`);
                    setResults(response.data);
                } catch (error) {
                    console.error('Error fetching search results:', error);
                } finally {
                    setLoading(false); // Set loading to false after fetching
                }
            }
        };

        fetchSearchResults();
    }, [query]);

    if (user?.roles.includes("User")) {
        return (
            <div className="search-results">
                <TopBar />
               <h1>You are not allowed to search other users</h1>
               <Footer />
            </div>
        )
    }

    return (
        <div className="search-results">
            <TopBar />
            {loading ? (
                <h1>Loading...</h1> // Show loading indicator while fetching
            ) : (
                <>
                    <Heading as="h2" mt={4} textAlign="center" style={{ color: "green" }}>{results.length} Results Found</Heading>
                    <div className="all-cards-container">
                        {results.length ? (
                            <ul className='overall-card-container'>
                                {results.map((user) => (
                                    <li className='search-result-list individual-card' key={user._id}>
                                        <p className='search-result-content'><strong>Username:</strong> {user.username || "None"}</p>
                                        <p className='search-result-content'><strong>Email:</strong> {user.email || "None"}</p>
                                        <p className='search-result-content'><strong>Phone Number: </strong>{user.phoneNumber || "None"}</p>
                                        <p className='search-result-content'><strong>Address: </strong>{user.address || "None"}</p>
                                        <p className='search-result-content'><strong>Medical History: </strong>{user.medicalHistory || "None"}</p>
                                        <p className='search-result-content'><strong>Current Medication: </strong>{user.currentMedication || "None"}</p>
                                        <p className='search-result-content'><strong>Vaccination: </strong>{user.vaccination || "None"}</p>
                                        <p className='search-result-content'><strong>Emergency Contact Name: </strong>{user.emergencyContactName || "None"}</p>
                                        <p className='search-result-content'><strong>Relationship: </strong>{user.relationship || "None"}</p>
                                        <p className='search-result-content'><strong>Emergency Contact Number: </strong>{user.emergencyContactNumber || "None"}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <h1 style={{fontSize: "3rem", color: "red", textAlign: "center"}}>No results found</h1>
                        )}
                    </div>
                </>
            )}
            <Footer />
        </div>
    );
};

export default SearchResults;
