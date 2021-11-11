import React from "react";

export const LoginTextInput = ({ name, value, onChange, error }) => {
    return (
        <div className="login-input">
            <input type = "text" name = {name} value = {value} placeholder="Username" onChange = {onChange} />
            <p style = {{color: "#cc7351", letterSpacing: "2px", display: error ? "block" : "none"}}>{name} can't be blank</p>
        </div>
    )
}
