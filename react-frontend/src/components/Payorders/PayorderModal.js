import React from "react";



// Children
import { DateInput } from "../common-components/inputs/DateInput";
import { TextInput } from "../common-components/inputs/TextInput";
import { SelectInput } from "../common-components/inputs/SelectInput";
import { NumberInput } from "../common-components/inputs/NumberInput";


export const PayorderModal = ({ 
    date, 
    setDate,  
    dispatch, 
    payorder, 
    payorderName, 
    isModalDisplayed, 
    hideModal, 
    successFailMessage, 
    onChange, 
    addUpdatePayorder, 
    error 
}) => {
    
    const selectInputValues = [
        {_id: 1, value:  "Released"},
        {_id: 2, value:  "Not Released"}
    ];

    const selectInputValues2 = [
        {_id: 1, value:  "Approved"},
        {_id: 2, value:  "Rejected"},
        {_id: 3, value:  "Pending"}
    ];



    return (
        <div className="modal" style = {{display:  isModalDisplayed ? "block" : "none"}}>
            <button className = "close-modal" onClick = {hideModal}>X</button>
            <div className="modal-content item-modal-content" id="payorder-modal-content">
                <button className="add-update-button" onClick = {() => addUpdatePayorder(date, payorderName, payorder)}>Post</button>
                <h2>Payorder Details</h2>
                <div className="success-fail-message" style ={{display: successFailMessage !== null ? "flex": "none"}}>
                    <p>{ successFailMessage }</p>
                    <button id="message-close" onClick = {() => dispatch({type: "ADD_UPDATE_ITEM"})}>X</button>
                </div>
                <div className="input-divs">
                    <DateInput label = "Date" date = {date} setDate = {setDate} error = {error} />
                    <TextInput 
                    label = "Payorder No" 
                    name = "payorder_no" 
                    value = {payorder.payorder_no} 
                    onChange = {onChange}
                    error = {error} 
                    />
                    <TextInput 
                    label = "Bank Name" 
                    name = "bank_name" 
                    value = {payorder.bank_name} 
                    onChange = {onChange}
                    error = {error}
                    />
                    <TextInput 
                    label = "Branch Name" 
                    name = "branch_name" 
                    value = {payorder.branch_name} 
                    onChange = {onChange}
                    error = {error} 
                    />
                    <TextInput 
                    label = "Receiver Name" 
                    name = "receiver_name" 
                    value = {payorder.receiver_name} 
                    onChange = {onChange}
                    error = {error} 
                    />
                    <NumberInput 
                    label = "Amount" 
                    name = "total_amount" 
                    value = {payorder.total_amount} 
                    onChange = {onChange}
                    error = {error} 
                    />
                    <TextInput 
                    label = "Remarks" 
                    name = "remarks" 
                    value = {payorder.remarks} 
                    onChange = {onChange}
                    error = {error} 
                    />
                    <SelectInput 
                    label = "Releasing Status" 
                    name = "release_status" 
                    value = {payorder.release_status} 
                    values = {selectInputValues} 
                    onChange = {onChange} error = {error} 
                    />
                    <SelectInput 
                    label = "Approval Status" 
                    name = "approval_status" 
                    value = {payorder.approval_status} 
                    values = {selectInputValues2} 
                    onChange = {onChange} error = {error} 
                    />
                    
                </div>
            </div>
        </div>
    );

}


