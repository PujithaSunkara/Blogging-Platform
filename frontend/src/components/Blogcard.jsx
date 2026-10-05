import React, { useState } from "react";
import axios from "axios";
import Commentsection from "./commentsection";
import "../styles/blogcard.css";

function Blogcard({ blog }) {
    const [likeCount, setLikeCount] = useState(blog.likeCount || 0);
    const [liked, setLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);

    const handleLike = async () => {
        try {
            const response = await axios.put(
                `http://localhost:5000/api/blogs/${blog._id}/like`,
                {},
                {
                    withCredentials: true
                }
            );

            setLikeCount(response.data.likeCount);
            setLiked(response.data.liked);
        } catch (error) {
            console.log(error);
        }
    };

    const toggleComments = () => {
        setShowComments((previous) => !previous);
    };

    return (
        <article className="blog-card">

            {/* CATEGORY */}
            <span className="blog-category">
                {blog.category}
            </span>

            {/* TITLE */}
            <h2>{blog.title}</h2>

            {/* CONTENT */}
            <p className="blog-content">
                {blog.content}
            </p>

            {/* AUTHOR */}
            <div className="blog-author">

                <div className="author-avatar">
                    {blog.author?.name
                        ? blog.author.name.charAt(0).toUpperCase()
                        : "U"}
                </div>

                <span className="author-name">
                    {blog.author?.name || "Unknown User"}
                </span>

            </div>

            {/* ACTIONS */}
            <div className="blog-actions">

                <button
                    className={`like-btn ${liked ? "liked" : ""}`}
                    onClick={handleLike}
                >
                    {liked ? "♥" : "♡"} {likeCount}
                </button>

                <button
                    className="comment-toggle"
                    onClick={toggleComments}
                >
                    💬{" "}
                    {showComments
                        ? "Hide Comments"
                        : `Comments${blog.commentCount ? ` (${blog.commentCount})` : ""}`}
                </button>

            </div>

            {/* COMMENTS */}
            {showComments && (
                <div className="comments-dropdown comments-open">
                    <Commentsection blogId={blog._id} />
                </div>
            )}

        </article>
    );
}

export default Blogcard;