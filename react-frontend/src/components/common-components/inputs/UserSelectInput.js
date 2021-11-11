import React from "react"

export const UserSelectInput = ({ dynamic_class, label, name, value, values, onChange, error, role }) => {

    return (
        <div className = {dynamic_class}>
            <label>{label}</label>
            <select name={name} onChange = {onChange} value = {value} disabled={typeof role !== "undefined" && role !== "Director" && "true"} >
                <option value = {value}>{value}</option>
                {values.map(item => {
                    return <option key = {item._id} value = {item.value}>{item.value}</option>
                })}
            </select>
            <p className="validation-errors" style = {{
                display: typeof error !== "undefined" && error && !value ? "block" : "none", color: "#f8a488"}
                }>
                {label.toLowerCase()} can't be blank
            </p>
        </div>
    );
}
