const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const User = require("./user");
const Blog = require("./blog");
const Comment = require("./comment");

const app = express();


app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

app.use(cookieParser());




mongoose
    .connect("mongodb://127.0.0.1:27017/project6")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });



app.post("/api/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: "Account created successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Signup failed"
        });
    }
});




app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            "bloggingSecretKey",
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax"
        });

        res.json({
            message: "Login successful"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Login failed"
        });
    }
});



app.post("/api/logout", (req, res) => {

    res.clearCookie("token");

    res.json({
        message: "Logged out successfully"
    });
});



async function getLoggedInUser(req) {

    const token = req.cookies.token;

    if (!token) {
        return null;
    }

    try {

        const decoded = jwt.verify(
            token,
            "bloggingSecretKey"
        );

        const user = await User.findById(decoded.userId);

        return user;

    } catch (error) {

        return null;

    }
}




app.get("/api/profile", async (req, res) => {

    try {

        const user = await getLoggedInUser(req);

        if (!user) {
            return res.status(401).json({
                message: "Please login"
            });
        }


       
        const blogCount = await Blog.countDocuments({
            author: user._id
        });


        const commentCount = await Comment.countDocuments({
            userId: user._id
        });


        const myBlogs = await Blog.find({
            author: user._id
        });


       
        let likeCount = 0;

        myBlogs.forEach((blog) => {
            likeCount += blog.likes.length;
        });


        res.json({

            name: user.name,

            email: user.email,

            blogCount: blogCount,

            commentCount: commentCount,

            likeCount: likeCount

        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Could not get profile"
        });

    }

});



app.get("/api/blogs", async (req, res) => {

    try {

        const blogs = await Blog.find({
            posted: true
        })
            .populate("author", "name")
            .sort({ createdAt: -1 });


        const result = await Promise.all(

            blogs.map(async (blog) => {

                const commentCount =
                    await Comment.countDocuments({
                        blogId: blog._id
                    });


                return {

                    ...blog.toObject(),

                    likeCount: blog.likes.length,

                    commentCount: commentCount

                };

            })

        );


        res.json(result);


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Could not get blogs"
        });

    }

});


app.get("/api/myblogs", async (req, res) => {

    try {

        const user = await getLoggedInUser(req);

        if (!user) {

            return res.status(401).json({
                message: "Please login"
            });

        }


        const blogs = await Blog.find({
            author: user._id
        })
            .sort({ createdAt: -1 });


        res.json(blogs);


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Could not get your blogs"
        });

    }

});

app.post("/api/blogs", async (req, res) => {

    try {

        const user = await getLoggedInUser(req);

        if (!user) {

            return res.status(401).json({
                message: "Please login"
            });

        }


        const {
            title,
            content,
            category
        } = req.body;


        const blog = new Blog({

            title,

            content,

            category,

            author: user._id,

            posted: false,

            likes: []

        });


        await blog.save();


        res.status(201).json({

            message: "Blog added successfully",

            blog

        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Could not add blog"
        });

    }

});




app.put("/api/blogs/:id", async (req, res) => {

    try {

        const user = await getLoggedInUser(req);

        if (!user) {

            return res.status(401).json({
                message: "Please login"
            });

        }


        const blog = await Blog.findOne({

            _id: req.params.id,

            author: user._id

        });


        if (!blog) {

            return res.status(404).json({
                message: "Blog not found"
            });

        }


        blog.title = req.body.title;

        blog.content = req.body.content;

        blog.category = req.body.category;


        await blog.save();


        res.json({

            message: "Blog updated successfully"

        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Could not update blog"
        });

    }

});



app.delete("/api/blogs/:id", async (req, res) => {

    try {

        const user = await getLoggedInUser(req);

        if (!user) {

            return res.status(401).json({
                message: "Please login"
            });

        }


        const blog = await Blog.findOne({

            _id: req.params.id,

            author: user._id

        });


        if (!blog) {

            return res.status(404).json({
                message: "Blog not found"
            });

        }


        
        await Comment.deleteMany({

            blogId: blog._id

        });


        // Delete blog
        await Blog.findByIdAndDelete(blog._id);


        res.json({

            message: "Blog deleted successfully"

        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Could not delete blog"
        });

    }

});


app.put("/api/blogs/:id/post", async (req, res) => {

    try {

        const user = await getLoggedInUser(req);

        if (!user) {

            return res.status(401).json({
                message: "Please login"
            });

        }


        const blog = await Blog.findOne({

            _id: req.params.id,

            author: user._id

        });


        if (!blog) {

            return res.status(404).json({
                message: "Blog not found"
            });

        }


        blog.posted = true;


        await blog.save();


        res.json({

            message: "Blog posted successfully"

        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Could not post blog"
        });

    }

});




app.put("/api/blogs/:id/like", async (req, res) => {

    try {

        const user = await getLoggedInUser(req);

        if (!user) {

            return res.status(401).json({
                message: "Please login"
            });

        }


        const blog = await Blog.findById(req.params.id);


        if (!blog) {

            return res.status(404).json({
                message: "Blog not found"
            });

        }


        const alreadyLiked = blog.likes.some(

            (id) =>
                id.toString() === user._id.toString()

        );


        if (alreadyLiked) {

            // Unlike
            blog.likes = blog.likes.filter(

                (id) =>
                    id.toString() !==
                    user._id.toString()

            );

        } else {

            // Like
            blog.likes.push(user._id);

        }


        await blog.save();


        res.json({

            likeCount: blog.likes.length,

            liked: !alreadyLiked

        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Could not like blog"
        });

    }

});



app.get("/api/blogs/:id/comments", async (req, res) => {

    try {

        const comments = await Comment.find({

            blogId: req.params.id

        })
            .populate("userId", "name")
            .sort({ createdAt: 1 });


        res.json(comments);


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Could not get comments"
        });

    }

});



app.post("/api/blogs/:id/comments", async (req, res) => {

    try {

        const user = await getLoggedInUser(req);

        if (!user) {

            return res.status(401).json({
                message: "Please login"
            });

        }


        const comment = new Comment({

            blogId: req.params.id,

            userId: user._id,

            text: req.body.text

        });


        await comment.save();


        const newComment =
            await Comment.findById(comment._id)
                .populate("userId", "name");


        res.status(201).json(newComment);


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Could not add comment"
        });

    }

});



app.delete("/api/comments/:id", async (req, res) => {

    try {

        const user = await getLoggedInUser(req);

        if (!user) {

            return res.status(401).json({
                message: "Please login"
            });

        }


        const comment = await Comment.findOne({

            _id: req.params.id,

            userId: user._id

        });


        if (!comment) {

            return res.status(404).json({
                message: "Comment not found"
            });

        }


        await Comment.findByIdAndDelete(
            comment._id
        );


        res.json({

            message: "Comment deleted"

        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Could not delete comment"
        });

    }

});




app.listen(5000, () => {

    console.log(
        "Server running on port 5000"
    );

});