import "./styles/profile.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";

function Profile() {

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        axios
            .get(
                "https://blogging-platform-bnka.onrender.com/api/profile",
                {
                    withCredentials: true
                }
            )
            .then((response) => {

                setProfile(response.data);
                setLoading(false);

            })
            .catch((error) => {

                console.log(error);
                setLoading(false);

            });

    }, []);


    if (loading) {

        return (
            <>
                <Navbar />

                <div className="profile-loading">
                    <div className="loading-circle"></div>
                    <p>Loading profile...</p>
                </div>
            </>
        );

    }


    if (!profile) {

        return (
            <>
                <Navbar />

                <div className="empty-state">
                    <h2>Unable to load profile</h2>
                    <p>Please login again.</p>
                </div>
            </>
        );

    }


    return (
        <>
            <Navbar />

            <main className="profile-page">

                <div className="profile-container">

                    {/* PROFILE HEADER */}

                    <section className="profile-header-card">

                        <div className="profile-avatar">
                            {profile.name
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="profile-info">

                            <span className="section-tag">
                                YOUR PROFILE
                            </span>

                            <h1>
                                {profile.name}
                            </h1>

                            <p>
                                ✉ {profile.email}
                            </p>

                        </div>

                        <div className="profile-decoration">
                            ✦
                        </div>

                    </section>


                    {/* STATS */}

                    <section className="profile-stats">

                        <div className="profile-stat blog-stat">

                            <div className="stat-icon">
                                📝
                            </div>

                            <div>
                                <strong>
                                    {profile.blogCount}
                                </strong>

                                <span>
                                    Blogs Created
                                </span>
                            </div>

                        </div>


                        <div className="profile-stat like-stat">

                            <div className="stat-icon">
                                ❤️
                            </div>

                            <div>
                                <strong>
                                    {profile.likeCount}
                                </strong>

                                <span>
                                    Total Likes
                                </span>
                            </div>

                        </div>


                        <div className="profile-stat comment-stat">

                            <div className="stat-icon">
                                💬
                            </div>

                            <div>
                                <strong>
                                    {profile.commentCount}
                                </strong>

                                <span>
                                    Comments
                                </span>
                            </div>

                        </div>

                    </section>


                    {/* ABOUT */}

                    <section className="profile-about">

                        <div className="about-symbol">
                            ✨
                        </div>

                        <div>

                            <h2>
                                Keep creating.
                            </h2>

                            <p>
                                Your ideas have a place here.
                                Continue writing, sharing your
                                experiences and connecting with
                                readers through your stories.
                            </p>

                        </div>

                    </section>


                    <div className="profile-quote">
                        "Every story is worth telling."
                    </div>

                </div>

            </main>
        </>
    );
}

export default Profile;