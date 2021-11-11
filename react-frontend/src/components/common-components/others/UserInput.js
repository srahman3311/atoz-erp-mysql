import React from "react";

export const UserInput = ({ label, name, value, error, onChange }) => {
    return (
        <div className="user-input">
            <label>{label}</label>
            <input type="text" name={name} value = {value} onChange = {onChange} />
            <p className="validation-errors" style = {{display: error && !value ? "block" : "none", color: "#ec4646"}}>
                {label.toLowerCase()} can't be blank
            </p>
        </div>
    )
}
