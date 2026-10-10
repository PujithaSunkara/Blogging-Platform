import "./styles/auth.css";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                "https://blogging-platform-bnka.onrender.com/api/login",
                {
                    email,
                    password
                },
                {
                    withCredentials: true
                }
            );

            navigate("/home");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-brand">
                    <div className="auth-logo">✦</div>

                    <h1>Welcome Back</h1>

                    <p>
                        Sign in to continue your blogging journey
                    </p>
                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>

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
                            placeholder="Enter your password"
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
                        Login
                    </button>

                </form>


                <div className="auth-divider">
                    <span>New to BlogSpace?</span>
                </div>


                <Link
                    to="/signup"
                    className="auth-secondary-button"
                >
                    Create an Account
                </Link>

            </div>

        </div>
    );
}

export default Login;