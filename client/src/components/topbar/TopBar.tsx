import React, { useState } from "react";
import "./TopBar.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/ReduxStore";
import { logoutUser } from "../../redux/slices/AuthenticationSlice";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, IconButton, Input, InputGroup, InputLeftElement, } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const TopBar: React.FC = () => {
    const loggedInUser = useSelector((state: RootState) => state.user.user);
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [searchQuery, setSearchQuery] = useState("");

    const handleLogout = () => {
        dispatch(logoutUser());
        localStorage.removeItem("userId");
        window.location.href = "/login";
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(`Search query: ${searchQuery}`);
        navigate(`/search?query=${searchQuery}`);
    };

    const isCurrentPath = (path: string) => location.pathname === path;

    return (
        <nav className="topbar">
            <div className="title">
                <img className="company-logo" id="logo" src="https://plus.unsplash.com/premium_vector-1682310717908-db9ed503a9c3?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="company logo" width={30} height={30} />
                <h1 className="topbar-header">Q-Response</h1>
            </div>
            <ul className="topbar-unordered-list">
                <li className="topbar-list-item">
                    <Link
                        to="/"
                        style={{ color: isCurrentPath("/") ? "#9747FF" : undefined, pointerEvents: isCurrentPath("/") ? "none" : undefined }}
                    >
                        Home
                    </Link>
                </li>
                <li className="topbar-list-item">
                    <Link
                        to="/alerts"
                        style={{ color: isCurrentPath("/alerts") ? "#9747FF" : undefined, pointerEvents: isCurrentPath("/alerts") ? "none" : undefined }}
                    >
                        Alerts
                    </Link>
                </li>
                <li className="topbar-list-item">
                    <Link
                        to="/records"
                        style={{ color: isCurrentPath("/records") ? "#9747FF" : undefined, pointerEvents: isCurrentPath("/records") ? "none" : undefined }}
                    >
                        Records
                    </Link>
                </li>
                
                {(loggedInUser?.roles.includes("Admin") || loggedInUser?.roles.includes("Employee")) && 
                <form className="search-form" onSubmit={handleSearch}>
                    <InputGroup>
                    <InputLeftElement>
                    <IconButton
                        type="submit"
                        colorScheme='blue'
                        variant="unstyled"
                        aria-label='Search database'
                        size='lg'
                        icon={<SearchIcon />}
                    />

                    </InputLeftElement>
                    <Input
                        width={{ base: "50px", md: "200px" }}
                        type="text"
                        className="searchInput"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        
                    />
                    </InputGroup>
                   
                </form>}
                <li className="topbar-list-item">
                    <Link
                        to="/settings"
                        style={{ color: isCurrentPath("/settings") ? "#9747FF" : undefined, pointerEvents: isCurrentPath("/settings") ? "none" : undefined }}
                    >
                        <img id="profilepic" className="profile-pic" src={loggedInUser?.profileUrl || "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=1024x1024&w=is&k=20&c=oGqYHhfkz_ifeE6-dID6aM7bLz38C6vQTy1YcbgZfx8="} width={30} height={30} />
                    </Link>
                </li>
                <li className="topbar-list-item-button">
                    <Button className="logout-button" bg="brand.purplebtn"ml={2} colorScheme="purple" onClick={handleLogout}
                    >Logout</Button>
                </li>
            </ul>
        </nav>
    );
};

export default TopBar;
