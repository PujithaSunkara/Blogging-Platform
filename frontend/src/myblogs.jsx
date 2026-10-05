import "./styles/myblogs.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";

function MyBlogs() {

    const [blogs, setBlogs] = useState([]);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");

    const [editingId, setEditingId] = useState(null);


    const getBlogs = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/myblogs",
                {
                    withCredentials: true
                }
            );

            setBlogs(response.data);

        } catch (error) {
            console.log(error);
        }

    };


    useEffect(() => {
        getBlogs();
    }, []);


    const clearForm = () => {
        setTitle("");
        setContent("");
        setCategory("");
        setEditingId(null);
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (editingId) {

                await axios.put(
                    `http://localhost:5000/api/blogs/${editingId}`,
                    {
                        title,
                        content,
                        category
                    },
                    {
                        withCredentials: true
                    }
                );

            } else {

                await axios.post(
                    "http://localhost:5000/api/blogs",
                    {
                        title,
                        content,
                        category
                    },
                    {
                        withCredentials: true
                    }
                );

            }

            clearForm();
            getBlogs();

        } catch (error) {
            console.log(error);
        }

    };


    const editBlog = (blog) => {

        setEditingId(blog._id);

        setTitle(blog.title);
        setContent(blog.content);
        setCategory(blog.category);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    const deleteBlog = async (id) => {

        if (!window.confirm("Delete this blog?")) {
            return;
        }

        try {

            await axios.delete(
                `http://localhost:5000/api/blogs/${id}`,
                {
                    withCredentials: true
                }
            );

            getBlogs();

        } catch (error) {
            console.log(error);
        }

    };


    const postBlog = async (id) => {

        try {

            await axios.put(
                `http://localhost:5000/api/blogs/${id}/post`,
                {},
                {
                    withCredentials: true
                }
            );

            getBlogs();

        } catch (error) {
            console.log(error);
        }

    };


    return (
        <>
            <Navbar />

            <main className="myblogs-page">

                <div className="page-container">

                    <div className="myblogs-heading">

                        <div>
                            <p className="section-tag">
                                YOUR CREATIVE SPACE
                            </p>

                            <h1>My Blogs</h1>

                            <p>
                                Write, edit and share your stories.
                            </p>
                        </div>

                        <div className="heading-icon">
                            ✍️
                        </div>

                    </div>


                    {/* FORM */}

                    <section className="blog-editor">

                        <div className="editor-title">

                            <div className="editor-icon">
                                {editingId ? "✏️" : "＋"}
                            </div>

                            <div>
                                <h2>
                                    {editingId
                                        ? "Edit Your Story"
                                        : "Create a New Story"}
                                </h2>

                                <p>
                                    {editingId
                                        ? "Make your story even better."
                                        : "Turn your ideas into something worth reading."}
                                </p>
                            </div>

                        </div>


                        <form onSubmit={handleSubmit}>

                            <div className="form-group">

                                <label>Blog Title</label>

                                <input
                                    type="text"
                                    placeholder="Give your story a beautiful title..."
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    }
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>Category</label>

                                <input
                                    type="text"
                                    placeholder="Technology, Travel, Life..."
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>Your Story</label>

                                <textarea
                                    placeholder="Start writing your story..."
                                    value={content}
                                    onChange={(e) =>
                                        setContent(e.target.value)
                                    }
                                    rows="7"
                                    required
                                />

                            </div>


                            <div className="editor-buttons">

                                <button
                                    type="submit"
                                    className="primary-btn"
                                >
                                    {editingId
                                        ? "Update Blog"
                                        : "Save Blog"}
                                </button>


                                {editingId && (

                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={clearForm}
                                    >
                                        Cancel
                                    </button>

                                )}

                            </div>

                        </form>

                    </section>


                    {/* BLOG LIST */}

                    <div className="myblogs-list-header">

                        <h2>Your Stories</h2>

                        <span>
                            {blogs.length} blog
                            {blogs.length !== 1 ? "s" : ""}
                        </span>

                    </div>


                    {blogs.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                📝
                            </div>

                            <h2>
                                Your blog collection is empty
                            </h2>

                            <p>
                                Create your first story above.
                            </p>

                        </div>

                    ) : (

                        <div className="myblogs-grid">

                            {blogs.map((blog) => (

                                <div
                                    className="myblog-card"
                                    key={blog._id}
                                >

                                    <div className="myblog-top">

                                        <span className="category-badge">
                                            {blog.category}
                                        </span>

                                        <span
                                            className={
                                                blog.posted
                                                    ? "status posted"
                                                    : "status draft"
                                            }
                                        >
                                            {blog.posted
                                                ? "● Posted"
                                                : "● Draft"}
                                        </span>

                                    </div>


                                    <h3>
                                        {blog.title}
                                    </h3>


                                    <p>
                                        {blog.content}
                                    </p>


                                    <div className="myblog-actions">

                                        <button
                                            className="edit-btn"
                                            onClick={() =>
                                                editBlog(blog)
                                            }
                                        >
                                            ✏️ Edit
                                        </button>


                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                deleteBlog(blog._id)
                                            }
                                        >
                                            🗑 Delete
                                        </button>


                                        {!blog.posted && (

                                            <button
                                                className="post-btn"
                                                onClick={() =>
                                                    postBlog(blog._id)
                                                }
                                            >
                                                🚀 Post
                                            </button>

                                        )}

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </main>
        </>
    );
}

export default MyBlogs;