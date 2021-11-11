import React from "react";
// Children
import { TextInput } from "../common-components/inputs/TextInput";
import { SelectInput } from "../common-components/inputs/SelectInput";
import { NumberInput } from "../common-components/inputs/NumberInput";

export const JobModal = ({ job, jobName, dispatch, addUpdateJob, onChange, error, isModalDisplayed, hideModal, successFailMessage }) => {
    // destructuring the job object for readability
    const { heading, name, description, value, credit, status } = job;
    // for option values of select element
    const selectInputValues = [
        {_id: 1, value:  "Active"},
        {_id: 2, value:  "Inactive"},
        {_id: 3, value:  "Cancelled"},
        {_id: 4, value:  "Completed"},
    ];

    return (
        <div className="modal" style = {{display:  isModalDisplayed ? "block" : "none"}}>
            <button className = "close-modal" onClick = {hideModal}>X</button>
            
            <div className="modal-content" id="job-modal-content">
                <button className="add-update-button" onClick = {() => addUpdateJob(jobName, job)}>Post</button>
                
                <h2>Job Details</h2>
            
                <div className="success-fail-message" style ={{display: successFailMessage !== null ? "flex": "none"}}>
                    <p>{ successFailMessage }</p>
                    <button id="message-close" onClick = {() => dispatch({type: "ADD_UPDATE_ITEM"})}>X</button>
                </div>
                <div className="input-divs">
                    <TextInput label = "Job Heading" name = "heading" value = {heading} onChange = {onChange} error = {error} />
                    <TextInput label = "Name" name = "name" value = {name} onChange = {onChange} error = {error} />
                    <TextInput label = "Description" name = "description" value = {description} onChange = {onChange} error = {error} />
                    <NumberInput label = "Value" name = "value" value = {value} onChange = {onChange} />
                    <NumberInput label = "Credit" name = "credit" value = {credit} onChange = {onChange} />
                    <SelectInput label = "Status" name = "status" value = {status} values = {selectInputValues} onChange = {onChange} error = {error} />
                </div>
            </div>
        </div>
    );

}



