import React from "react"

export const Dates = () => {
    return (
        <div className = "date-search">
            <div className="start-date">
                <label>Start Date</label>
                <DatePicker selected={props.startDate} onChange={date => props.setStartDate(date)} />
            </div>
            <div className="end-date">
                <label>End Date</label>
                <DatePicker selected={props.endDate} onChange={date => props.setEndDate(date)} />
            </div>
        </div>
    );
}
