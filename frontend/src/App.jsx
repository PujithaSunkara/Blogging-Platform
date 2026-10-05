import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./login";
import Signup from "./signup";
import Home from "./home";
import MyBlogs from "./myblogs";
import Profile from "./profile";

function App() {
    return (
      

            <Routes>

                <Route
                    path="/"
                    element={<Navigate to="/login" />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />

                <Route
                    path="/home"
                    element={<Home />}
                />

                <Route
                    path="/myblogs"
                    element={<MyBlogs />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />

            </Routes>

        
    );
}

export default App;