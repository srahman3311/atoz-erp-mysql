import React from "react";


// Children
import { DateInput } from "../common-components/inputs/DateInput";
import { TextInput } from "../common-components/inputs/TextInput";
import { ListInput } from "../common-components/inputs/ListInput";
import { NumberInput } from "../common-components/inputs/NumberInput";
import { SelectInput } from "../common-components/inputs/SelectInput";


export const ExpenseModal = ({
    dispatch,
    addUpdateExpense, 
    isModalDisplayed, 
    hideModal, 
    successFailMessage,
    date, 
    setDate,
    expense,
    error,
    expenseID,
    materialUnit,  
    list, 
    onChange, 
    selectItem, 
    isJobListVisible,
    isSubheadListVisible,
    isMaterialListVisible
}) => {

    const selectInputValues = [
        {_id: 1, value:  "Pending"},
        {_id: 2, value:  "Approved"},
        {_id: 3, value:  "Rejected"}
    ];
    return (
        <div className="modal" style = {{display:  isModalDisplayed ? "block" : "none"}}>
            <button className = "close-modal" onClick = {hideModal}>X</button>
            <div className="modal-content" id = "expense-modal-content">
                <button
                className = "add-update-button" 
                value = {expenseID} 
                onClick = {() => addUpdateExpense(expenseID, expense, date, materialUnit, localStorage.getItem("name"))}>
                    Post
                </button>
                <h2>Expense Details</h2>
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
                    value = {expense.job}
                    item = {expense.job} 
                    onChange = {onChange} 
                    selectItem = {selectItem}
                    isListVisible = {isJobListVisible}
                    items = {list.job} 
                    error = {error} 
                    
                    />

                    <ListInput 
                    label = "Subhead"
                    className = "subhead" 
                    name = "subhead" 
                    value = {expense.subhead}
                    item = {expense.subhead} 
                    onChange = {onChange} 
                    selectItem = {selectItem}
                    isListVisible = {isSubheadListVisible}
                    items = {list.subhead} 
                    error = {error} 
                    />

                    
                    <ListInput 
                    label = "Material"
                    className = "material" 
                    name = "material" 
                    value = {expense.material}
                    item = {expense.material} 
                    onChange = {onChange} 
                    selectItem = {selectItem}
                    isListVisible = {isMaterialListVisible}
                    items = {list.material} 
                    error = {error} 
                    />

                    <TextInput 
                    label = "Description" 
                    name = "description" 
                    value = {expense.description} 
                    onChange = {onChange} 
                    error = {error} 
                    />

                    <NumberInput 
                    label = "Quantity" 
                    name = "qty" 
                    value = {expense.qty} 
                    onChange = {onChange}
                    error = {error} 
                    />

                    <TextInput 
                    label = "Unit" 
                    name = "unit"
                    value = {materialUnit}
                    onChange = {onChange}
                    disabled = {true}
                    error = {error} 
                    />

                    <NumberInput 
                    label = "Unit Price" 
                    name = "unit_price" 
                    value = {expense.unit_price} 
                    onChange = {onChange} 
                    error = {error} 
                    />

                    <NumberInput 
                    label = "Discount" 
                    name = "discount" 
                    value = {expense.discount} 
                    onChange = {onChange}
                    />

                    <NumberInput 
                    label = "Upcharge" 
                    name = "upcharge" 
                    value = {expense.upcharge} 
                    onChange = {onChange} 
                    />

                    <SelectInput 
                    label = "Status" 
                    name = "status" 
                    value = {expense.status} 
                    values = {selectInputValues} 
                    onChange = {onChange} 
                    error = {error} 
                    />

                </div>
            </div>
        </div>
    );

}


