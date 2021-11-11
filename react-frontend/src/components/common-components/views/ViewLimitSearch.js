import React from "react";

export const ViewLimitSearch = ({ searchItems, searchText, changeViewLimit }) => {
    return (
        <div className="view-limit-search">
            <div className="view-limit">
                <select name="viewLimit" onChange = {event => changeViewLimit(event.target.value)}>
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
            <div className="search">
                <input onChange={event => searchItems(event.target.value)} type="text" placeholder="Search" value={searchText} />
            </div>
        </div>
    )
}
