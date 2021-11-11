import React from "react";


export const NumberInput = ({ label, disabled, name, value, error, onChange }) => {

    return (
        <div className="input-div number-input-div">
            <label>{label}</label>
            <input 
            disabled = {typeof disabled !== "undefined" ? disabled : ""} 
            type="number" name={name} 
            value = {value} 
            onChange = {onChange} 
            />
            <p className="validation-errors" style = {{
                display: typeof error !== "undefined" && error && !value ? "block" : "none", color: "red", fontSize: "0.9rem"}
                }>
                {label.toLowerCase()} can't be blank
            </p>
        </div>
    );
}

