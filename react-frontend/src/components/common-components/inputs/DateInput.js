import React from "react";
import DatePicker from "react-datepicker";
// Date Picker CSS
import "react-datepicker/dist/react-datepicker.css";


export const DateInput = ({ label, date, setDate, error }) => {
    return (
        <div className="input-div date-input-div">
            <label>{label}</label>
            <DatePicker id="date-input" selected={date} onChange={date => setDate(date)} />
            <p className="validation-errors" style = {{display: error && !date ? "block" : "none", color: "red", fontSize: "0.9rem"}}>
                {label.toLowerCase()} can't be blank
            </p>
        </div>
    );
}
