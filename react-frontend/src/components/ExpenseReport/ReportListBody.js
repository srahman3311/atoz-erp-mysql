import React from "react";


// Children
import { NoDataTR } from "../common-components/tr-td/NoDataTR";



export const ReportListBody = ({ results }) => {
   
    

    return (
        <tbody>
        {
            !results.length 
            ?
            <NoDataTR colSpan = "13"/>
            :
            results.map(item => {
                return (
                    <tr key = {item.serial_no}>
                       <td>{item.serial_no}</td>
                        <td>{item.date_time.substring(0, item.date_time.indexOf("T"))}</td>
                        <td>{item.spent_by}</td>
                        <td>{item.spent_by}</td>
                        <td>{item.job}</td> 
                        <td>{item.material_name}</td>
                        <td>{item.subhead}</td>
                        <td>{item.description}</td>
                        <td>{item.total}</td>
                        <td>{item.status}</td>
                        {/* <td>{payorder.payorder_no}</td>
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
                        </td> */}
                    </tr>          
                );
            })
        }
    </tbody>
    );
}
