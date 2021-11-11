import React from "react";



export const UserPasswordInput = ({ dynamic_class, label, name, placeholder, value, onChange, error }) => {

    return (
        <div className = {dynamic_class} style = {{ marginBottom: "30px" }}>
            <label style = {{ display: dynamic_class === "user-password-input" ? "block" : "none" }}>{label}</label>
            <input 
            type = "password" 
            name = {name} 
            value = {value} 
            placeholder = { typeof placeholder !== "undefined" ? placeholder : "" } 
            onChange = {onChange} 
            />
            <p style = {{color: "red", letterSpacing: "2px", display: error && !value ? "block" : "none"}}>{name} can't be blank</p>

        </div>
    )
}
