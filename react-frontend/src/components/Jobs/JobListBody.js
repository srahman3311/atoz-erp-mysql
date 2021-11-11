import React, { useContext } from "react";
// Context
import { JobContext } from "../../contexts/job_contex/JobContext";
// Children
import { NoDataTR } from "../common-components/tr-td/NoDataTR";


export const JobListBody = ({ toggleActionList, displayModal, toggleDeleteModal, actionListId }) => {
    // Using context
    const { jobState } = useContext(JobContext);

    return (
        <tbody>
        {
            !jobState.jobs.length 
            ?
            <NoDataTR colSpan = "10"/>
            :
            jobState.jobs.map(job => {
                return (
                    <tr key = {job.serial_no}>
                        <td>{job.serial_no}</td>
                        <td>{job.heading}</td>
                        <td>{job.name}</td>
                        <td>{job.description}</td>
                        <td>{job.value}</td>
                        <td>{job.credit}</td>
                        <td>{job.debit}</td>
                        <td>{job.balance}</td>
                        <td>{job.status}</td>
                        <td className="action-list-td">
                            <button value={job.serial_no} onClick={ev => toggleActionList(ev.target.value)} className="action-button">
                                action
                            </button>
                            <div className="action-list" style={{display: actionListId === job.serial_no ? "block" : "none"}}>
                                <button className="action-list-buttons" value = {job.serial_no} onClick = {displayModal}>
                                    Update
                                </button>
                                <button className="action-list-buttons" value={job.name} onClick={ev => toggleDeleteModal(ev.target.value)}>
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
