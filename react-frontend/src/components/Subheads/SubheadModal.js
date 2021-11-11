import React, { useState } from "react";
import axios from "axios";


// Importing Input Component
import { TextInput } from "../common-components/inputs/TextInput";
import { SelectInput } from "../common-components/inputs/SelectInput";

export const SubheadModal = ({ 
    dispatch, 
    subhead, 
    subheadID, 
    isModalDisplayed, 
    hideModal, 
    successFailMessage, 
    onChange, 
    addUpdateSubhead,
    error 
}) => {

    return (
        <div className="modal" style = {{display:  isModalDisplayed ? "block" : "none"}}>
            <button className = "close-modal" onClick = {hideModal}>X</button>
            <div className="modal-content item-modal-content" id="subhead-modal-content">
                <button className="add-update-button" onClick = {() => addUpdateSubhead(subheadID, subhead)}>Post</button>
                <h2>Subhead Details</h2>
                <div className="success-fail-message" style ={{display: successFailMessage !== null ? "flex": "none"}}>
                    <p>{ successFailMessage }</p>
                    <button id="message-close" onClick = {() => dispatch({type: "ADD_UPDATE_ITEM"})}>X</button>
                </div>
                <div className="input-divs">
                    <TextInput 
                    label = "Subhead Name" 
                    name = "name" 
                    value = {subhead.name} 
                    onChange = {onChange}
                    error = {error} 
                    />
                </div>
            </div>
        </div>
    )
}
