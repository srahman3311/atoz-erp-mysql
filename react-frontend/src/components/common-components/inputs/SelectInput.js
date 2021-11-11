import React from "react"

export const SelectInput = ({ label, name, value, values, onChange, error }) => {

    // console.log(value);
    return (
        <div className="input-div select-input-div">
            <label>{label}</label>
            <select name={name} onChange = {onChange} value = {value} >
                <option value = {value}>{value}</option>
                {values.map(item => {
                    return <option key = {item._id} value = {item.value}>{item.value}</option>
                })}
            </select>
            <p className="validation-errors" style = {{
                display: typeof error !== "undefined" && error && !value ? "block" : "none", color: "red", fontSize: "0.9rem"}
                }>
                {label.toLowerCase()} can't be blank
            </p>
        </div>
    );
}
