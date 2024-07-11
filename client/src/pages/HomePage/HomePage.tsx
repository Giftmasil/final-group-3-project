import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/ReduxStore';
import "./HomePage.css"
import TopBar from '../../components/topbar/TopBar';

const Home: React.FC = () => {
    const loggedInUser = useSelector((state: RootState) => state.user.user);

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
            <div className='homecontainer'>
              <p>Q-response is an emergency response app designed to quickly assess and report emergencies</p>
              <button id="emergency" onClick={toEmergency}>Emergency</button>
              <div className='middle-section'>
              <img className = "placeholder" src =  "https://plus.unsplash.com/premium_vector-1712873279566-379ba42df159?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="first aid kit" />
              <div extra-info>
                <p>What are your thoughts on being prepared in case of an emergency?
                Its time to level up your skills.</p>
              <div className='chatbot'><img className = "ai-icon" src="https://plus.unsplash.com/premium_vector-1712873279566-379ba42df159?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="learn first aid" />
              <p>learn first aid with AI</p></div>
            </div>
            </div>
            </div>
        </div>
    );
};

export default Home;
