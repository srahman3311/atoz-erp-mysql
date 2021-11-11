import React, { useState } from "react";
import axios from "axios";


// Importing Input Component
import { TextInput } from "../common-components/inputs/TextInput";
import { SelectInput } from "../common-components/inputs/SelectInput";

export const MaterialModal = ({ 
    dispatch, 
    material, 
    materialID, 
    isModalDisplayed, 
    hideModal, 
    successFailMessage, 
    onChange, 
    addUpdateMaterial,
    error 
}) => {

    const selectInputValues = [
        {_id: 1, value:  "Approved"},
        {_id: 2, value:  "Rejected"},
        {_id: 3, value:  "Pending"}
    ];

    return (
        <div className="modal" style = {{display:  isModalDisplayed ? "block" : "none"}}>
            <button className = "close-modal" onClick = {hideModal}>X</button>
            <div className="modal-content" id="material-modal-content">
                <button className="add-update-button" onClick = {() => addUpdateMaterial(materialID, material)}>Post</button>
                <h2>Material Details</h2>
                <div className="success-fail-message" style ={{display: successFailMessage !== null ? "flex": "none"}}>
                    <p>{ successFailMessage }</p>
                    <button id="message-close" onClick = {() => dispatch({type: "ADD_UPDATE_ITEM"})}>X</button>
                </div>
                <div className="input-divs">
                    <TextInput 
                    label = "Material Name" 
                    name = "name" 
                    value = {material.name} 
                    onChange = {onChange}
                    error = {error} 
                    />

                    <TextInput 
                    label = "Material Unit" 
                    name = "unit" 
                    value = {material.unit} 
                    onChange = {onChange}
                    error = {error} 
                    />

                    <SelectInput 
                    label = "Status" 
                    name = "status" 
                    value = {material.status} 
                    values = {selectInputValues} 
                    onChange = {onChange} 
                    error = {error} 
                    />
                </div>
            </div>
        </div>
    )
}
