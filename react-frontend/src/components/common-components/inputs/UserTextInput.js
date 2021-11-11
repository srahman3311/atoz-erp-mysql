import React from "react";


export const UserTextInput = ({ dynamic_class, label, role, name, value, error, onChange }) => {

    return (
        <div className={dynamic_class}>
            <label>{label}</label>
            <input 
            disabled={typeof role !== "undefined" && role !== "Director" && "true"} 
            type="text" name={name} 
            value = {value} 
            onChange = {onChange} 
            />
            <p className="validation-errors" style = {{
                display: typeof error !== "undefined" && error && !value ? "block" : "none", color: "#f8a488"}
                }>
                {label.toLowerCase()} can't be blank
            </p>
        </div>
    );
}

