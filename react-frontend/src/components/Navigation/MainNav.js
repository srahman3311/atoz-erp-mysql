import React, { useContext, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";


import { CommonContext } from "../../contexts/common_contexts/CommonContext";

export const MainNav = () => {

    const history = useHistory();


    const { showSideNav, setShowSideNav, showProfileMenu, setShowProfileMenu } = useContext(CommonContext);

    // const [showMenu, setShowMenu] = useState(false);

    const logout = () => {
        // As cookie can't be removed from client side so this task should be sent to backend but make 
        // sure that withCredentials:true is sent along with the request otherwise cookie won't be removed. 
        axios.get("http://localhost:3030/api/users/logout", {withCredentials: true})
            .then(res => {
                setShowProfileMenu(false)
                localStorage.clear();
                history.push("/");
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="main-nav">
            <div className="main-nav-wrapper">
                <div className="nav-brand">
                    <button id="menu-bar-button" onClick = {() => showSideNav ? setShowSideNav(false) : setShowSideNav(true)}>
                        <i className="fas fa-bars"></i>
                    </button>
                    <Link id="brand" to = "/dashboard">A TO Z Trading</Link>
                </div>
                <div className="nav-profile-link">
                    <button id="profile-button" 
                    onClick = {() => showProfileMenu ? setShowProfileMenu(false) : setShowProfileMenu(true)}>
                        <img style ={{borderRadius: "50%"}} width="40" height="40" src={localStorage.getItem("imgUrl")} alt="" />
                    </button>
                    <div id="nav-profile-menu" style={{display: showProfileMenu ? "block" : "none"}}>
                        <Link to = {`/profile/${localStorage.getItem("name")}`}>Profile</Link>
                        <button id="logout-button" onClick = {logout}>Logout</button>
                    </div>
                </div>
            </div>
        </div>
    );
}


















/*
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import { Link } from "react-router-dom";

// Styling
import "./Navbar.css";



function Navbar(props) {

    const history = useHistory();

    const name = localStorage.getItem("name");
    const [imgUrl, setImgUrl] = useState("");

    useEffect(() => {
        axios.post("http://localhost:3030/api/users/user", {username: name})
            .then(res => {
                setImgUrl(res.data.imgUrl);
            })
            .catch(err => console.log(err));
    }, []);


     // Logout
     function logout() {
        // As cookie can't be removed from client side so this task should be sent to backend but make 
        // sure that withCredentials:true is sent along with the request otherwise cookie won't be removed. 
        axios.get("http://localhost:3030/api/users/logout", {withCredentials: true})
            .then(res => {
                localStorage.clear();
                history.push("/");
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="navbar">
            <div className="brand">
                <Link id="brand" to = "/dashboard">A TO Z Trading</Link>
            </div>
            <div className="profile-logout">
                <Link to = "/users">Users</Link>
                <Link to = {`/profile/${name}`}>
                    <img style ={{borderRadius: "50%"}} width="40" height="40" src={imgUrl} alt="image" />
                </Link>
                <Link to = {`/profile/${name}`}>Profile</Link>
                <Link role="button" onClick = {logout}>Logout</Link>
            </div>
        </div>
    );
}


export default Navbar;

*/
