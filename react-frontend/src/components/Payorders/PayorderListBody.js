import React, { useContext } from "react";
// Context
import { PayorderContext } from "../../contexts/payorder_context/PayorderContext";
// Children
import { NoDataTR } from "../common-components/tr-td/NoDataTR";


export const PayorderListBody = ({ toggleActionList, displayModal, toggleDeleteModal, actionListId }) => {
    // Using context
    const { payorderState } = useContext(PayorderContext);

    return (
        <tbody>
        {
            !payorderState.payorders.length 
            ?
            <NoDataTR colSpan = "12"/>
            :
            payorderState.payorders.map(payorder => {
                return (
                    <tr key = {payorder.serial_no}>
                       <td>{payorder.serial_no}</td>
                        <td>
                            {payorder.date_time !== null && payorder.date_time.substring(0, payorder.date_time.indexOf("T"))}         
                        </td>
                        <td>{payorder.payorder_no}</td>
                        <td>{payorder.bank_name}</td>
                        <td>{payorder.branch_name}</td>
                        <td>{payorder.receiver_name}</td>
                        <td>{payorder.total_amount}</td>
                        <td>{payorder.release_status}</td>
                        <td>{payorder.approval_status}</td>
                        <td>{payorder.added_by}</td>
                        <td>{payorder.remarks}</td>
                        <td className="action-list-td">
                            <button 
                            value = {payorder.serial_no} 
                            onClick = {ev => toggleActionList(ev.target.value)} 
                            className = "action-button">
                                action
                            </button>
                            <div className="action-list" style={{display: actionListId === payorder.serial_no ? "block" : "none"}}>
                                <button className="action-list-buttons" value = {payorder.serial_no} onClick = {displayModal}>
                                    Update
                                </button>
                                <button 
                                className="action-list-buttons" 
                                value={payorder.payorder_no} 
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
