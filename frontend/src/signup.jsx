import "./styles/auth.css";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Signup() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const navigate = useNavigate();


    const handleSignup = async (e) => {

        e.preventDefault();

        try {

            await axios.post(
                "https://blogging-platform-bnka.onrender.com/api/signup",
                {
                    name,
                    email,
                    password
                }
            );

            navigate("/login");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Signup failed"
            );

        }
    };


    return (
        <div className="auth-page">

            <div className="auth-card signup-card">

                <div className="auth-brand">

                    <div className="auth-logo">
                        ✦
                    </div>

                    <h1>Create Account</h1>

                    <p>
                        Start sharing your ideas with the world
                    </p>

                </div>


                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}


                <form onSubmit={handleSignup}>

                    <div className="auth-input-group">

                        <label>Full Name</label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            required
                        />

                    </div>


                    <div className="auth-input-group">

                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>


                    <div className="auth-input-group">

                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="auth-button"
                    >
                        Create Account
                    </button>

                </form>


                <div className="auth-divider">
                    <span>Already have an account?</span>
                </div>


                <Link
                    to="/login"
                    className="auth-secondary-button"
                >
                    Login Instead
                </Link>

            </div>

        </div>
    );
}

export default Signup;