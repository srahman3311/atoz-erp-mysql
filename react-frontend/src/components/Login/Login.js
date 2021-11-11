import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

// Auth Middleware
import { isAuthenticated } from "../Auth/Auth";

// children
import { LoginHeader } from "./LoginHeader";
import { LoginTextInput } from "./LoginTextInput";
import { LoginPasswordInput } from "./LoginPasswordInput";
// Component Stylesheet
import "./Login.css";






export const Login = () => {

    const history = useHistory();

    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [userInfo, setUserInfo] = useState({username: "", password: ""});


    // to hide main and side nav
    useEffect(() => {
        document.querySelector(".main-nav").style.display = "none";
        document.querySelector(".side-nav").style.display = "none";
    }, []);


    const onChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setUserInfo(previousValue => {
            return {
                ...previousValue,
                [name]: value
            };
        });
    }

    const login = () => {
        // Form Validation
        if(!userInfo.username) {
            setErrorMsg("");
            setUsernameError(true);
            return;
        }
        if(!userInfo.password) {
            setErrorMsg("");
            setUsernameError(false);
            setPasswordError(true);
            return;
        }

        // If form validation is done
        axios.post("http://localhost:3030/api/users/login", userInfo, {withCredentials: true})
            .then(res => {
                localStorage.setItem("name", res.data[0].username);
                localStorage.setItem("role", res.data[0].role);
                localStorage.setItem("status", res.data[0].status);
                localStorage.setItem("imgUrl", res.data[0].imgUrl);
                localStorage.setItem("filename", res.data[0].filename);
                history.push("/dashboard");
            })
            .catch(err => {
                setUsernameError(false);
                setPasswordError(false);
                setErrorMsg(err.response.data.msg);
                return;
            });
    }

    if(isAuthenticated()) {
        return (
            <div>{history.push("/dashboard")}</div>
        );
    } 


    return (
        <div className="content login" id = "login">
            <div className="login-wrapper" id="login-wrapper">
                <LoginHeader errorMsg = {errorMsg} />
                <LoginTextInput 
                    name = "username" 
                    value = {userInfo.username} 
                    onChange = {onChange}
                    error = {usernameError} 
                />
                <LoginPasswordInput
                    name = "password" 
                    value = {userInfo.password} 
                    onChange = {onChange}
                    error = {passwordError}  
                />
                <div className="button-container" id = "login-button">
                    <button onClick = {login}>Login</button>
                </div>
            </div>
        </div>
    );
    
}
