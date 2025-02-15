import React from "react";
import "../css/navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <div className="main-navbar">
            <div className="left-side"></div>
            <div className="right-side">
                <div className="login">
                    <Link to="/login/" className="login-btn" >Login</Link>
                </div>
            </div>
        </div>
    );
}
