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
import { SubheadListHeader } from "./SubheadListHeader";
import { SubheadListBody } from "./SubheadListBody";
import { SubheadModal } from "./SubheadModal";
import { DeleteModal } from "../common-components/delete-prompt-modal/DeleteModal";


// Contexts
import {SubheadContext } from "../../contexts/subhead_context/SubheadContext";
import { CommonContext } from "../../contexts/common_contexts/CommonContext";


export const SubheadList = () => {
    const history = useHistory();
    // Json web token is needed to be sent to backend for checking if api calls through axios are authorized or not
    const cookies = new Cookies();
    const jwtToken = cookies.get("jwtToken");
    // Subhead Contexts
    const { 
        subheadState, 
        dispatch, 
        addUpdateSubhead, 
        changeViewLimit, 
        searchSubheads, 
        showNextPrevSubheads, 
        toggleDeleteModal, 
        toggleActionList, 
        deleteSubhead 
    } = useContext(SubheadContext);
    // Common Contexts
    const { setShowSideNav } = useContext(CommonContext);

    // States
    // Need to send unique Subhead id to backend for updating record
    const [subheadID, setSubheadID] = useState(0);
    // For toggling modal
    const [isModalDisplayed, setIsModalDisplayed] = useState(false);
    const [subhead, setSubhead] = useState({ name: "" });
    // function for fetching data at component mount and hideModal
    const fetchData = (limit, offset, searchText) => {
        const endPoint = "http://localhost:3030/api/subheads";
        // Search text is for re-using endPoint  
        const options = { limit, offset, searchText };
        const headers = { "x-auth-token": jwtToken };
        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: "FETCH_DATA",
                    payload: {
                        subheads: res.data.subheads,
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
        
        setSubhead(prev => {
            return {...prev, [name]: value}
        });
    }

    const displayModal = e => {
        // hide the action list after user clicks on update button
        dispatch({type: "TOGGLE_ACTION_LIST", payload: 0})
        setIsModalDisplayed(true);
        // for updating a specific Subhead
        if(e.target.value !== "") {
            subheadState.subheads.map(item => {
                if(item.serial_no === Number(e.target.value)) {
                    // need to send unique job name to backend for updating
                    setSubheadID(item.serial_no);
                    setSubhead(previousValue => { return { ...previousValue, name: item.name }});
                }           
            });
        }
    }

    const hideModal = () => {
        setIsModalDisplayed(false);
        // // to setting the form validation error to false, so that modal doesn't show previous validation error messages
        // dispatch({type: "FORM_VALIDATION_ERROR", payload: false});
        // set jobName to null if modal was displayed for updating
        setSubheadID(0);
        // return the job to it's initial state
        setSubhead(previousValue => { return { ...previousValue, name: "" } });
        // to update the list with newly added item or updated item
        fetchData(subheadState.limit, subheadState.offset, subheadState.searchTextValue);
    }

    function exportToPdf() {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "Material Report";
        const headers = [[ "Serial No", "Subhead Name" ]];

        const data = subheadState.subheads.map(item => [ item.serial_no, item.name ]);

        let content = {
            startY: 50,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("MaterialReport.pdf")
    }

    // if user in not authenticated redirect to home/login page
    if(!isAuthenticated()) {
        return <div>{history.push("/")}</div>
    }

    return (
        <div className="content subhead-list" onClick = {() => setShowSideNav(false)}>
            <ListTitle title = "Subhead List" />
            <div className = "content-search-export">
                <ViewLimitSearch 
                searchItems = {searchSubheads} 
                searchText = {subheadState.searchTextValue} 
                changeViewLimit = {changeViewLimit} 
                />
                <Export exportToPdf = {exportToPdf} data = {subheadState.subheads}/>
                <ModalButton textContent = "Add New Subhead" displayModal = {displayModal} />
            </div>
            <div className="list">
                <table>
                    <SubheadListHeader />
                    <SubheadListBody 
                    toggleActionList = {toggleActionList}
                    displayModal = {displayModal}
                    toggleDeleteModal = {toggleDeleteModal}
                    actionListId = {subheadState.actionListId}
                    />
                </table>
            </div>
            <NextPrevView
            totalListLength = {subheadState.totalListLength} 
            limit = {subheadState.limit}
            offset = {subheadState.offset}
            showNextPrevItems = {showNextPrevSubheads}
            searchText = {subheadState.searchTextValue}
            />
            <SubheadModal 
            isModalDisplayed = {isModalDisplayed} 
            subhead = {subhead}
            error = {subheadState.formValidationError} 
            onChange = {onChange}
            addUpdateSubhead = {addUpdateSubhead}
            subheadID = {subheadID}
            successFailMessage = {subheadState.successFailMessage}
            dispatch = {dispatch}
            hideModal = {hideModal}
            />
            <DeleteModal 
            displayDeleteModal = {subheadState.displaySubheadDeleteModal}
            toggleDeleteModal = {toggleDeleteModal} 
            itemName = {subheadState.subheadID}
            deleteItem = {deleteSubhead}
            offset = {subheadState.offset}
            limit = {subheadState.limit}
            searchText = {subheadState.searchTextValue}
            />
        </div>
    )
}

