import React from "react";

export const Input = ({ name, onChange, searchText}) => {
    return (
        <input 
        className="dropdown-search job-dropdown-search" 
        name={name}
        type="text" 
        onChange = {onChange}
        value={searchText}
        placeholder="Find" 
        autoComplete="off"
        />
    );
}
