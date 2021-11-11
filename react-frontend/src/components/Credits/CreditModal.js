import React from "react";


// Children
import { DateInput } from "../common-components/inputs/DateInput";
import { TextInput } from "../common-components/inputs/TextInput";
import { ListInput } from "../common-components/inputs/ListInput";
import { NumberInput } from "../common-components/inputs/NumberInput";


export const CreditModal = ({
    dispatch,
    addUpdateCredit, 
    isModalDisplayed, 
    hideModal, 
    successFailMessage,
    date, 
    setDate,
    credit,
    error,
    creditID,
    list, 
    onChange, 
    selectItem, 
    isJobListVisible
}) => {

    return (
        <div className="modal" style = {{display:  isModalDisplayed ? "block" : "none"}}>
            <button className = "close-modal" onClick = {hideModal}>X</button>
            <div className="modal-content" id = "credit-modal-content">
                <button
                className = "add-update-button" 
                value = {creditID} 
                onClick = {() => addUpdateCredit(creditID, credit, date)}>
                    Post
                </button>
                <h2>Credit Details</h2>
                <div className="success-fail-message" style ={{display: successFailMessage !== null ? "flex": "none"}}>
                    <p>{ successFailMessage }</p>
                    <button id="message-close" onClick = {() => dispatch({type: "ADD_UPDATE_ITEM"})}>X</button>
                </div>
                <div className="input-divs">

                    <DateInput 
                    label = "Date" 
                    date = {date} 
                    setDate = {setDate}
                    error = {error} 
                    />
                    
                    <ListInput 
                    label = "Job"
                    className = "job" 
                    name = "job" 
                    value = {credit.job}
                    item = {credit.job} 
                    onChange = {onChange} 
                    selectItem = {selectItem}
                    isListVisible = {isJobListVisible}
                    items = {list.job} 
                    error = {error} 
                    />

                    <NumberInput 
                    label = "Amount" 
                    name = "amount" 
                    value = {credit.amount} 
                    onChange = {onChange}
                    error = {error} 
                    />

                    <TextInput 
                    label = "Remarks" 
                    name = "remarks" 
                    value = {credit.remarks} 
                    onChange = {onChange} 
                    error = {error} 
                    />


                </div>
            </div>
        </div>
    );

}


