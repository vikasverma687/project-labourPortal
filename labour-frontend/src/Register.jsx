import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Css/Register.css";
import Login from "./Login";

function Register() {
    const [username, setUserName] = useState("");
   
    const [phoneNo, setPhoneNo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const role = "LABOURER";

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username  || !password || !confirmPassword) {
            setMessage("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        try {
            const response = await fetch("http://localhost:8081/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, phoneNo ,password , role }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setTimeout(() => { navigate("/Login"); }, 2000);
            } else {
                setMessage(data.message || "Registration failed");
            }
        } catch (error) {
            setMessage(error);
        }
    };

    return (
        <div className="body">
            <div className="container">
                <h1>hii skillMan Register yourself</h1>
                <div className="login-box">
                    <h2>
                        Register as{" "}
                        <Link
                            to="/Register-Customer"
                            className="customer-link"
                        >
                            Customer
                        </Link>
                    </h2>

                    <form onSubmit={handleRegister}>
                        <input
                            type="text"
                            placeholder="user name"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                        />

                          <input
                            type="number"
                            placeholder="phone number"
                            value={phoneNo}
                            onChange={(e) => setPhoneNo(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <button type="submit">Register</button>
                    </form>

                    <p>
                        Already have an account? <Link to="/Login">Login</Link>
                    </p>
                    {message && <p className="message">{message}</p>}
                </div>
            </div>
        </div>
    );
}

export default Register;