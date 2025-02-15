import React, { useState } from "react";
import "../css/login.css";
import API from "../api/custom_axios";
import { data, useNavigate } from "react-router-dom";


export default function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();


    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!username && !password){
            return;
        }

        try {
            const LoginPostResponse = await API.post("login/",{
                'username': username,
                'password': password
            });

            if(LoginPostResponse.status === 200){
                localStorage.setItem('login-token', LoginPostResponse.data.access);
                localStorage.setItem('refresh-token', LoginPostResponse.data.refresh);
                navigate("/customer-details/");
            }
        } catch (error) {
            console.log(error)
        }

    }


    return (
        <div className="login-main">
            <div className="login-box">
                <h2 className="login-title">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Username</label>
                        <input 
                            type="text"
                            value={username}
                            onChange={(e)=>setUsername(e.target.value)}
                            placeholder="Enter your username" />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" className="login-btn">
                        Login
                    </button>
                </form>
                <p className="login-footer">
                    Don't have an account? <a href="#">Sign up</a>
                </p>
            </div>
        </div>
    );
}
