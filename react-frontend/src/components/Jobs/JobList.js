import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useHistory } from "react-router-dom";

// Auth Middleware
import { isAuthenticated } from "../Auth/Auth";


// Children
import { ViewLimitSearch } from "../common-components/views/ViewLimitSearch";
import { NextPrevView } from "../common-components/views/NextPrevView";
import { Export } from "../common-components/export-buttons/Export";
import { ModalButton } from "../common-components/others/ModalButton";
import { ListTitle } from "../common-components/list-title/ListTitle";
import { JobListHeader } from "./JobListHeader";
import { JobListBody } from "./JobListBody";
import { JobModal } from "./JobModal";
import { DeleteModal } from "../common-components/delete-prompt-modal/DeleteModal";


// Contexts
import { JobContext } from "../../contexts/job_contex/JobContext";
import { CommonContext } from "../../contexts/common_contexts/CommonContext";


export const JobList = () => {
    const history = useHistory();
    // Json web token is needed to be sent to backend for checking if api calls through axios are authorized or not
    const cookies = new Cookies();
    const jwtToken = cookies.get("jwtToken");
    // Job Contexts
    const { 
        jobState, 
        dispatch, 
        addUpdateJob, 
        changeViewLimit, 
        searchJobs, 
        showNextPrevJobs, 
        toggleDeleteModal, 
        toggleActionList, 
        deleteJob 
    } = useContext(JobContext);
    // Common Contexts
    const { setShowSideNav } = useContext(CommonContext);
    // States
    // Need to send unique job name to backend for updating record
    const [jobName, setJobName] = useState(null);
    // For toggling modal
    const [isModalDisplayed, setIsModalDisplayed] = useState(false);
    const [job, setJob] = useState({
        heading: "",
        name: "",
        description: "",
        value: 0,
        credit: 0,
        status: ""
    });
    // function for fetching data at component mount and hideModal
    const fetchData = (limit, offset, searchText) => {
        const endPoint = "http://localhost:3030/api/jobs";
        // Search text is for re-using endPoint  
        const options = { limit, offset, searchText };
        const headers = { "x-auth-token": jwtToken };
        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: "FETCH_DATA",
                    payload: {
                        jobs: res.data.jobs,
                        totalListLength: res.data.results.length, 
                        limit,
                        offset,
                        searchText
                    }
                });
            })
            .catch(err => console.log(err));
    }
    // For fetching data at the component mount
    useEffect(() => {
        // hide side-nav at component mount
        setShowSideNav(false);
        // when component mounts or remounts after navigating away start everything from the beginning
        fetchData(15, 0, "");
    }, []);

    // Input onChange event handler function
    function onChange(e) {

        const name = e.target.name;
        const value = e.target.value;
        
        setJob(prev => {
            return {...prev, [name]: value}
        });
    }

    const displayModal = e => {
        // hide the action list after user clicks on update button
        dispatch({type: "TOGGLE_ACTION_LIST", payload: 0})
        setIsModalDisplayed(true);
        // for updating a specific job
        if(e.target.value !== "") {
            jobState.jobs.map(item => {
                if(item.serial_no === Number(e.target.value)) {
                    // need to send unique job name to backend for updating
                    setJobName(item.name);
                    setJob(previousValue => {
                        return {
                            ...previousValue,
                            heading: item.heading,
                            name: item.name,
                            description: item.description,
                            value: item.value,
                            credit: item.credit,
                            status: item.status
                        }
                    });
                }           
            });
        }
    }

    const hideModal = () => {
        setIsModalDisplayed(false);
        // // to setting the form validation error to false, so that modal doesn't show previous validation error messages
        // dispatch({type: "FORM_VALIDATION_ERROR", payload: false});
        // set jobName to null if modal was displayed for updating
        setJobName(null);
        // return the job to it's initial state
        setJob(previousValue => {
            return {
                ...previousValue,
                heading: "",
                name: "",
                description: "",
                value: 0,
                credit: 0,
                status: ""
            }
        });
        // to update the list with newly added item or updated item
        fetchData(jobState.limit, jobState.offset, jobState.searchTextValue);
    }

    function exportToPdf() {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "Job Report";
        const headers = [["Serial No", "Job Heading", "Job ID", "Job Name", "Value", "Credit", "Debit", "Balance", "Status"]];

        const data = jobState.jobs.map(job => [
            job.serial_no,
            job.heading,
            job.name,
            job.description,
            job.value,
            job.credit,
            job.debit,
            job.balance,
            job.status
        ]);

        let content = {
            startY: 50,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("jobReport.pdf")
    }

    // if user in not authenticated redirect to home/login page
    if(!isAuthenticated()) {
        return <div>{history.push("/")}</div>
    }
    
    return (
        <div className="content job-list" onClick = {() => setShowSideNav(false)}>
            <ListTitle title = "Job List" />
            <div className = "content-search-export">
                <ViewLimitSearch searchItems = {searchJobs} searchText = {jobState.searchTextValue} changeViewLimit = {changeViewLimit} />
                <Export exportToPdf = {exportToPdf} data = {jobState.jobs}/>
                <ModalButton textContent = "Add New Job" displayModal = {displayModal} />
            </div>
            <div className="list">
                <table>
                    <JobListHeader />
                    <JobListBody 
                    toggleActionList = {toggleActionList}
                    displayModal = {displayModal}
                    toggleDeleteModal = {toggleDeleteModal}
                    actionListId = {jobState.actionListId}
                    />
                </table>
            </div>
            <NextPrevView
            totalListLength = {jobState.totalListLength} 
            limit = {jobState.limit}
            offset = {jobState.offset}
            showNextPrevItems = {showNextPrevJobs}
            searchText = {jobState.searchTextValue}
            />
            <JobModal 
            isModalDisplayed = {isModalDisplayed} 
            job = {job}
            error = {jobState.formValidationError} 
            onChange = {onChange}
            addUpdateJob = {addUpdateJob}
            jobName = {jobName}
            successFailMessage = {jobState.successFailMessage}
            dispatch = {dispatch}
            hideModal = {hideModal}
            />
            <DeleteModal 
            displayDeleteModal = {jobState.displayJobDeleteModal}
            toggleDeleteModal = {toggleDeleteModal} 
            itemName = {jobState.jobName}
            deleteItem = {deleteJob}
            offset = {jobState.offset}
            limit = {jobState.limit}
            searchText = {jobState.searchTextValue}
            />
        </div>
    )
}

