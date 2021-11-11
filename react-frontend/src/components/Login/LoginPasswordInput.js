import React from "react";

export const LoginPasswordInput = ({ name, value, onChange, error }) => {
    return (
        <div className="login-input">
            <input type = "password" name = {name} value = {value} placeholder="Password" onChange = {onChange} />
            <p style = {{color: "#cc7351", letterSpacing: "2px", display: error ? "block" : "none"}}>{name} can't be blank</p>
        </div>
    )
}
