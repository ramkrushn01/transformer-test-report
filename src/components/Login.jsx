import React, { useEffect, useState } from "react";
import "../css/login.css";
import API from "../api/custom_axios";
import { useDispatch, useSelector } from "react-redux";
import { login,  } from "../redux/features/isUserLoggedInSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
    useEffect(() => {
        if(isAuthenticated){
            document.location.href = "/reports/";
        }
    }, []);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {isAuthenticated, loginToken} = useSelector((state)=> state.isUserLoggedIn);

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [showError, setShowError] = useState("");
    const [loginBtnText, setLoginBtnText] = useState("Login");


    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!username || !password){
            setShowError("Please enter your username and password.")
            return;
        }

        try {
            setLoginBtnText("Logging...");
            const LoginPostResponse = await API.post("login/",{
                'username': username,
                'password': password
            });

            if(LoginPostResponse.status === 200){
                const LoginToken = LoginPostResponse.data.access;
                const RefreshToken = LoginPostResponse.data.refresh;
                localStorage.setItem('login-token', LoginToken);
                localStorage.setItem('refresh-token', RefreshToken);
                dispatch(login(LoginToken));
                navigate('/reports/');
            }
            setShowError();
        } catch (error) {
            setShowError("Invalid username or password.");
            setLoginBtnText("Login");
        }

    }

    
    return (
        isAuthenticated ? "" :
            <div className="login-main">
            <div className="login-box">
                <h2 className="login-title">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Username</label>
                        <input 
                            type="text"
                            value={username}
                            onChange={(e)=>{setUsername(e.target.value); setShowError();}}
                            placeholder="Enter your username" />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e)=>{setPassword(e.target.value); ; setShowError();}}
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="error" style={{visibility: `${showError? "visible" : "hidden"}`}}>{showError}</div>
                    <button type="submit" className="login-btn">
                        {loginBtnText}
                    </button>
                </form>
                <p className="login-footer">
                    Don't have an account? <a href="#">Sign up</a>
                </p>
            </div>
        </div>
    );
}
