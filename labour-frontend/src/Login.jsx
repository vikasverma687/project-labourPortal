import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Css/Login.css";

function Login() {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setMessage("All fields are required");
            return;
        }


        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("successful login!");
                localStorage.setItem("token", data.token);
                localStorage.setItem("userId", data.userId);
                localStorage.setItem("role", data.role);
                const role = localStorage.getItem("role");
                console.log("user id is " + localStorage.getItem("userId") + " and role is " + role);

                if (role === "CUSTOMER") {
                        
                    setTimeout(() => { navigate("/Customer-Profile"); }, 2000);

                } else if (role === "LABOURER") {
                    setTimeout(() => { navigate("/Labourer-Profile"); }, 2000);
                }
            } else {
                setMessage(data.message || "Registration failed");
            }
        } catch (error) {
            setMessage("server error");
        }
    };


    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Welcome to Login</h1>
                <h1 className="login-title" style={{ color: "red" }}>{message}</h1>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="submit-btn">
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;