import React, { useState } from "react";
import "./TopBar.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/ReduxStore";
import { logoutUser } from "../../redux/slices/AuthenticationSlice";
import { useNavigate } from 'react-router-dom';

const TopBar: React.FC  = () => {
    const loggedInUser = useSelector((state: RootState) => state.user.user);
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");

    const handleLogout = () => {
        dispatch(logoutUser());
        window.location.href = "/login";
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(`Search query: ${searchQuery}`);
        navigate(`/search?query=${searchQuery}`);
    };

    return (
        <nav className="topbar">
            <div className="title">
                <img className="company-logo" id="logo" src="https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=is&k=20&c=tw9TuTigzhSlLA_b1Avy0X6GNF9ZFVvgTHIZ9i68Q0I=" alt="company logo" width={30} height={30} />
                <h1 className="topbar-header">Q-Response</h1>
            </div>
            <ul className="topbar-unordered-list">
                <li className="topbar-list-item"><a href="/">Home</a></li>
                <li className="topbar-list-item"><a href="/alerts">Alerts</a></li>
                <li className="topbar-list-item"><a href="/records">Records</a></li>
                <li className="topbar-list-item"><a href="/records">Search</a></li>
                <li className="topbar-list-item"><a href="/settings"><img id="profilepic" src={loggedInUser?.profileUrl || "https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=is&k=20&c=tw9TuTigzhSlLA_b1Avy0X6GNF9ZFVvgTHIZ9i68Q0I="} width={30} height={30} /></a></li>
                <form className="search-form" onSubmit={handleSearch}>
                    <input
                        type="text"
                        className="searchInput"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
                </form>
                <li className="topbar-list-item-button"><button onClick={handleLogout}>Logout</button></li>
            </ul>
        </nav>
    );
};

export default TopBar;
