import React from "react";



export const PasswordInput = ({ name, placeholder, value, onChange, error }) => {
    
    const errorStyle = {
        color: "red",
        letterSpacing: "2px",
        display: typeof error !== "undefined" && error ? "block" : "none",
        fontSize: "0.9rem"
    }

    return (
        <div className="input-div password-input-div" style ={{marginBottom: "30px"}}>
            <input type = "password" name = {name} value = {value} placeholder={placeholder} onChange = {onChange} />
            <p style = {errorStyle}>{name} can't be 0</p>

        </div>
    )
}
