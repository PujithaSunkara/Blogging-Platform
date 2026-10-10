import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/comments.css";

function Commentsection({ blogId }) {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchComments = async () => {
        try {
            const response = await axios.get(
                `https://blogging-platform-bnka.onrender.com/api/blogs/${blogId}/comments`,
                {
                    withCredentials: true
                }
            );

            setComments(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [blogId]);

    const addComment = async () => {
        if (!text.trim()) {
            return;
        }

        try {
            setLoading(true);

            await axios.post(
                `https://blogging-platform-bnka.onrender.com/api/blogs/${blogId}/comments`,
                {
                    text: text
                },
                {
                    withCredentials: true
                }
            );

            setText("");

            await fetchComments();

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            addComment();
        }
    };

    return (
        <div className="comment-section">

            {/* COMMENT INPUT */}
            <div className="comment-input-row">

                <input
                    type="text"
                    placeholder="Write a comment..."
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <button
                    onClick={addComment}
                    disabled={loading}
                >
                    {loading ? "Posting..." : "Post"}
                </button>

            </div>


            {/* COMMENTS LIST */}
            <div className="comments-list">

                {comments.length === 0 ? (

                    <div className="no-comments">
                        No comments yet. Be the first to comment!
                    </div>

                ) : (

                    comments.map((comment) => (

                        <div
                            className="comment-item"
                            key={comment._id}
                        >

                            <div className="comment-user">
                                {comment.userId?.name || "User"}
                            </div>

                            <div className="comment-text">
                                {comment.text}
                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}

export default Commentsection;