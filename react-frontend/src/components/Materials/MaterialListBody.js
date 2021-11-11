import React, { useContext } from "react";
// Context
import { MaterialContext } from "../../contexts/material_context/MaterialContext";
// Children
import { NoDataTR } from "../common-components/tr-td/NoDataTR";


export const MaterialListBody = ({ toggleActionList, displayModal, toggleDeleteModal, actionListId }) => {
    // Using context
    const { materialState } = useContext(MaterialContext);

    return (
        <tbody>
        {
            !materialState.materials.length 
            ?
            <NoDataTR colSpan = "12"/>
            :
            materialState.materials.map(material => {
                return (
                    <tr key = {material.serial_no}>
                       <td>{material.serial_no}</td>
                        
                        <td>{material.name}</td>
                        <td>{material.unit}</td>
                        <td>{material.status}</td>
                       
                        <td className="action-list-td">
                            <button 
                            value = {material.serial_no} 
                            onClick = {ev => toggleActionList(ev.target.value)} 
                            className = "action-button">
                                action
                            </button>
                            <div className="action-list" style={{display: actionListId === material.serial_no ? "block" : "none"}}>
                                <button className="action-list-buttons" value = {material.serial_no} onClick = {displayModal}>
                                    Update
                                </button>
                                <button 
                                className="action-list-buttons" 
                                value={material.serial_no} 
                                onClick={ev => toggleDeleteModal(ev.target.value)}>
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>          
                );
            })
        }
    </tbody>
    );
}
