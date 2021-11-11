import React, { useContext } from "react";
// Context
import { CreditContext } from "../../contexts/credit_context/CreditContext";
// Children
import { NoDataTR } from "../common-components/tr-td/NoDataTR";


export const CreditListBody = ({ toggleActionList, displayModal, toggleDeleteModal, actionListId }) => {
    // Using context
    const { creditState } = useContext(CreditContext);

    return (
        <tbody>
        {
            !creditState.credits.length 
            ?
            <NoDataTR colSpan = "17"/>
            :
            creditState.credits.map(credit => {
                return (
                    <tr key = {credit.serial_no}>
                        <td>{credit.serial_no}</td>
                        <td>
                            {credit.date_time !== null && credit.date_time.substring(0, credit.date_time.indexOf("T"))}
                        </td>
                        <td>{credit.job}</td>
                        <td>{credit.amount}</td>
                        <td>{credit.remarks}</td>
                        <td className="action-list-td">
                            <button value={credit.serial_no} onClick={ev => toggleActionList(ev.target.value)} className="action-button">
                                action
                            </button>
                            <div className="action-list" style={{display: actionListId === credit.serial_no ? "block" : "none"}}>
                                <button className="action-list-buttons" value = {credit.serial_no} onClick = {displayModal}>
                                    Update
                                </button>
                                <button 
                                className="action-list-buttons" 
                                value={credit.serial_no} 
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
