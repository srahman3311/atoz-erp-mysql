import React from 'react'

export const ModalButton = ({ displayModal, textContent }) => {
    return (
        <div className="add-data-button">
            <button className="add-button" onClick = {displayModal}>{textContent}</button>
        </div>
    )
}
