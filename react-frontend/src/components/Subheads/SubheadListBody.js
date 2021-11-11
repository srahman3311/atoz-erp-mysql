import React, { useContext } from "react";
// Context
import { SubheadContext } from "../../contexts/subhead_context/SubheadContext";
// Children
import { NoDataTR } from "../common-components/tr-td/NoDataTR";


export const SubheadListBody = ({ toggleActionList, displayModal, toggleDeleteModal, actionListId }) => {
    // Using context
    const { subheadState } = useContext(SubheadContext);

    return (
        <tbody>
        {
            !subheadState.subheads.length 
            ?
            <NoDataTR colSpan = "3"/>
            :
            subheadState.subheads.map(subhead => {
                return (
                    <tr key = {subhead.serial_no}>
                       <td>{subhead.serial_no}</td>
                        <td>{subhead.name}</td>
                        <td className="action-list-td">
                            <button 
                            value = {subhead.serial_no} 
                            onClick = {ev => toggleActionList(ev.target.value)} 
                            className = "action-button">
                                action
                            </button>
                            <div className="action-list" style={{display: actionListId === subhead.serial_no ? "block" : "none"}}>
                                <button className="action-list-buttons" value = {subhead.serial_no} onClick = {displayModal}>
                                    Update
                                </button>
                                <button 
                                className="action-list-buttons" 
                                value={subhead.serial_no} 
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
