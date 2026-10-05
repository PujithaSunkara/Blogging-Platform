import "../styles/navbar.css";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await axios.post(
                "http://localhost:5000/api/logout",
                {},
                { withCredentials: true }
            );

            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <nav className="navbar">

            <Link to="/home" className="navbar-logo">
                <span>✦</span>
                BlogSpace
            </Link>

            <div className="navbar-links">

                <Link to="/home">
                    🏠 Home
                </Link>

                <Link to="/myblogs">
                    ✍️ My Blogs
                </Link>

                <Link to="/profile">
                    👤 Profile
                </Link>

                <button onClick={logout} className="logout-btn">
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default Navbar;