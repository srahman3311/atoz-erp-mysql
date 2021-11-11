import React, { useContext } from "react";
// Context
import { ExpenseContext } from "../../contexts/expense_context/ExpenseContext";
// Children
import { NoDataTR } from "../common-components/tr-td/NoDataTR";


export const ExpenseListBody = ({ toggleActionList, displayModal, toggleDeleteModal, actionListId }) => {
    // Using context
    const { expenseState } = useContext(ExpenseContext);

    return (
        <tbody>
        {
            !expenseState.expenses.length 
            ?
            <NoDataTR colSpan = "17"/>
            :
            expenseState.expenses.map(expense => {
                return (
                    <tr key = {expense.serial_no}>
                        <td>{expense.serial_no}</td>
                        <td>
                            {expense.date_time !== null && expense.date_time.substring(0, expense.date_time.indexOf("T"))}
                        </td>
                        <td>{expense.job}</td>
                        <td>{expense.subhead}</td>
                        <td>{expense.material_name}</td>
                        <td>{expense.description}</td>
                        <td>{expense.qty}</td>
                        <td>{expense.unit}</td>
                        <td>{expense.unit_price}</td>
                        <td>{expense.discount}</td>
                        <td>{expense.upcharge}</td>
                        <td>{expense.total}</td>
                        <td>{expense.status}</td>
                        <td>{expense.spent_by}</td>
                        <td className="action-list-td">
                            <button value={expense.serial_no} onClick={ev => toggleActionList(ev.target.value)} className="action-button">
                                action
                            </button>
                            <div className="action-list" style={{display: actionListId === expense.serial_no ? "block" : "none"}}>
                                <button className="action-list-buttons" value = {expense.serial_no} onClick = {displayModal}>
                                    Update
                                </button>
                                <button 
                                className="action-list-buttons" 
                                value={expense.serial_no} 
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
