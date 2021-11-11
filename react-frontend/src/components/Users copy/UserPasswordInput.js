import React from "react";

export const UserPasswordInput = ({ placeholder, passwordError, name, value, onChange, error }) => {
    return (
        <div className="user-password-input">
            <input type = "password" name = {name} value = {value} placeholder={placeholder} onChange = {onChange} />
            <p 
            style = {{color: "#cc7351", letterSpacing: "2px", display: error && !value ? "block" : "none"}}>
                {name} can't be blank
            </p>
        </div>
    )
}
