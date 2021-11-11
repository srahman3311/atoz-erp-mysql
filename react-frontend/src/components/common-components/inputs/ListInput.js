import React from "react";


export const ListInput = ({ label, name, className, value, item, selectItem, items, isListVisible, onChange, error}) => {

    const listStyle = {
        display: isListVisible && item !== "" ? "block" : "none",
        zIndex: isListVisible && "1"
    };

    return (
        <div className="input-div list-input-div">
            <label>{label}</label>
            <input type="text" name = {name} value = {value} onChange = {onChange} autoComplete="off" />
            <div className="generated-list-container" style = {listStyle}>
                <div className="generated-list">
                    {
                        items.length === 0 ? 
                        <ul><li>No records found</li></ul> : 
                        <ul>
                            {items.map(itemValue => {
                                return (
                                <li key = {itemValue.serial_no} className = {className} onClick = {selectItem}>
                                    {itemValue.name}{typeof itemValue.description !== "undefined" && `(${itemValue.description})`}
                                </li>)
                            })}
                        </ul>
                    }
                </div>
            </div>
            
            <p className="validation-errors" style = {{display: error && !value ? "block" : "none", color: "red", fontSize: "0.9rem"}}>
                {label.toLowerCase()} can't be blank
            </p>
        </div>
    );
}

//style ={{display: isListVisible && item !== "" ? "block" : "none"}}


