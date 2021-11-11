import React from "react";

export const DeleteModal = ({ offset, limit, searchText, displayDeleteModal, toggleDeleteModal, itemName, deleteItem }) => {
    return (
        <div className="modal" style={{display: displayDeleteModal ? "block" : "none"}}>
             <div className="delete-mdal-wrapper">
                <div className="modal-content delete-modal-content">
                    <p style = {{marginBottom: "7px"}}>Are you sure want to delete?</p>
                    <div className="delete-modal-buttons">
                        <button style = {{marginRight: "10px"}} onClick = {() => deleteItem(itemName, offset, limit, searchText)}>
                            Yes
                        </button>
                        <button onClick = {() => toggleDeleteModal(null)}>No</button>
                    </div>
                </div>
            </div>
           
        </div>
    )
}
