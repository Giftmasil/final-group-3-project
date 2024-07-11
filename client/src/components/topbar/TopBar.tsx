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
                <img className="company-logo" id="logo" src="https://plus.unsplash.com/premium_vector-1712873279566-379ba42df159?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="company logo" width={30} height={30} />
                <h1 className="topbar-header">Q-Response</h1>
            </div>
            <ul className="topbar-unordered-list">
                <li className="topbar-list-item"><a href="/">Home</a></li>
                <li className="topbar-list-item"><a href="/alerts">Alerts</a></li>
                <li className="topbar-list-item"><a href="/records">Records</a></li>
                <li className="topbar-list-item"><a href="/settings"><img id="profilepic" className="profile-pic" src={loggedInUser?.profileUrl || "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=1024x1024&w=is&k=20&c=oGqYHhfkz_ifeE6-dID6aM7bLz38C6vQTy1YcbgZfx8="} width={30} height={30} /></a></li>
                {(loggedInUser?.roles.includes("Admin") || loggedInUser?.roles.includes("Employee")) && <form className="search-form" onSubmit={handleSearch}>
                    <input
                        type="text"
                        className="searchInput"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
                </form>}
                <li className="topbar-list-item-button"><button onClick={handleLogout}>Logout</button></li>
            </ul>
        </nav>
    );
};

export default TopBar;
