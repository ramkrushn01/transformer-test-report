import React from "react";
import "../css/navbar.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/features/isUserLoggedInSlice";

export default function Navbar() {
    const dispatch = useDispatch();
    const {isAuthenticated, loginToken} = useSelector((state)=> state.isUserLoggedIn);
    const navigate = useNavigate();

    const onLogin = ()=>{
        if(isAuthenticated){
            dispatch(logout());
        }else{
            navigate("/login/");
        }
    }
    
    return (
        <div className="main-navbar">
            <div className="left-side"></div>
            <div className="right-side">
                <div className="login">
                    <button onClick={onLogin} className="login-btn" >{isAuthenticated ? "Logout" : "login"}</button>
                </div>
            </div>
        </div>
    );
}
