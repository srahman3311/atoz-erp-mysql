import React from "react";

export const UserActionTD = ({ id, showID, toggleActionList, editRecord, togglePasswordModal }) => {
    return (
        <td className="action-td">
            <button
            value = {id} 
            onClick = {toggleActionList} 
            className="action-button">
                action
            </button>
            <div className="action-list" style={{display: showID === id ? "block" : "none"}}>
                <button className="edit-delete-button" value = {id} onClick = {editRecord}>edit</button>
                <button className="edit-delete-button" value = {id} onClick = {togglePasswordModal}>delete</button>
            </div>
        </td>
    )
}
