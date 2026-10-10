import "./styles/home.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Blogcard from "./components/Blogcard";

function Home() {

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const getBlogs = async () => {
        try {

            const response = await axios.get(
                "https://blogging-platform-bnka.onrender.com/api/blogs",
                {
                    withCredentials: true
                }
            );

            setBlogs(response.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        getBlogs();
    }, []);


    return (
        <>
            <Navbar />

            <main className="home-page">

                <div className="page-container">

                    <div className="home-heading">

                        <div>
                            <p className="section-tag">
                                DISCOVER • READ • SHARE
                            </p>

                            <h1>
                                Explore Stories
                            </h1>

                            <p>
                                Discover ideas, experiences and stories
                                shared by our community.
                            </p>
                        </div>

                        <div className="heading-icon">
                            ✦
                        </div>

                    </div>


                    {loading ? (

                        <div className="empty-state">
                            <div className="loading-circle"></div>
                            <p>Loading stories...</p>
                        </div>

                    ) : blogs.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                ✍️
                            </div>

                            <h2>
                                No stories yet
                            </h2>

                            <p>
                                Be the first one to create and post
                                an amazing blog.
                            </p>

                        </div>

                    ) : (

                        <div className="blogs-grid">

                            {blogs.map((blog) => (
                                <Blogcard
                                    key={blog._id}
                                    blog={blog}
                                />
                            ))}

                        </div>

                    )}

                </div>

            </main>
        </>
    );
}

export default Home;