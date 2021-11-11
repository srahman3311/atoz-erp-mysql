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
import { PayorderListHeader } from "./PayorderListHeader";
import { PayorderListBody } from "./PayorderListBody";
import { PayorderModal } from "./PayorderModal";
import { DeleteModal } from "../common-components/delete-prompt-modal/DeleteModal";


// Contexts
import { PayorderContext } from "../../contexts/payorder_context/PayorderContext";
import { CommonContext } from "../../contexts/common_contexts/CommonContext";


export const PayorderList = () => {

    const history = useHistory();
    // Json web token is needed to be sent to backend for checking if api calls through axios are authorized or not
    const cookies = new Cookies();
    const jwtToken = cookies.get("jwtToken");
    // Job Contexts
    const { 
        payorderState, 
        dispatch, 
        addUpdatePayorder, 
        changeViewLimit, 
        searchPayorders, 
        showNextPrevPayorders, 
        toggleDeleteModal, 
        toggleActionList, 
        deletePayorder 
    } = useContext(PayorderContext);
    // Common Contexts
    const { setShowSideNav } = useContext(CommonContext);
    // States
    // Need to send unique payorder name to backend for updating record
    const [date, setDate] = useState(null);
    const [payorderName, setPayorderName] = useState(null);
    // For toggling modal
    const [isModalDisplayed, setIsModalDisplayed] = useState(false);
    const [payorder, setPayorder] = useState({
        payorder_no: "",
        bank_name: "",
        branch_name: "",
        receiver_name: "",
        total_amount: 0,
        remarks: "",
        approval_status: "",
        release_status: "",
        added_by: localStorage.getItem("name")
    });
    // function for fetching data at component mount and hideModal
    const fetchData = (limit, offset, searchText) => {
        const endPoint = "http://localhost:3030/api/payorders";
        // Search text is for re-using endPoint  
        const options = { limit, offset, searchText };
        const headers = { "x-auth-token": jwtToken };
        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: "FETCH_DATA",
                    payload: {
                        payorders: res.data.payorders,
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
        
        setPayorder(prev => {
            return {...prev, [name]: value}
        });
    }

    const displayModal = e => {
        // hide the action list after user clicks on update button
        dispatch({type: "TOGGLE_ACTION_LIST", payload: 0})
        setIsModalDisplayed(true);
        // for updating a specific Payorder
        if(e.target.value !== "") {
            payorderState.payorders.map(item => {
                if(item.serial_no === Number(e.target.value)) {
                    // need to send unique job name to backend for updating
                    setPayorderName(item.payorder_no);
                    setDate(new Date(item.date_time));
                    setPayorder(previousValue => {
                        return {
                            ...previousValue,
                            payorder_no: item.payorder_no,
                            bank_name: item.bank_name,
                            branch_name: item.branch_name,
                            receiver_name: item.receiver_name,
                            total_amount: item.total_amount,
                            remarks: item.remarks,
                            approval_status: item.approval_status,
                            release_status: item.release_status
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
        setPayorderName(null);
        setDate(null);
        // return the job to it's initial state
        setPayorder(previousValue => {
            return {
                ...previousValue,
                payorder_no: "",
                bank_name: "",
                branch_name: "",
                receiver_name: "",
                total_amount: 0,
                remarks: "",
                approval_status: "",
                release_status: ""
            }
        });
        // to update the list with newly added item or updated item
        fetchData(payorderState.limit, payorderState.offset, payorderState.searchTextValue);
    }

    function exportToPdf() {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "Payorder Report";
        const headers = [["Serial No", "Payorder No", "Bank Name", "Branch Name", "Receiver Name", "Total Amount", "Remarks"]];

        const data = payorderState.payorders.map(item => [
            item.serial_no,
            item.payorder_no,
            item.bank_name,
            item.branch_name,
            item.receiver_name,
            item.total_amount,
            item.remarks
        ]);

        let content = {
            startY: 50,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("payorderReport.pdf")
    }

    // if user in not authenticated redirect to home/login page
    if(!isAuthenticated()) {
        return <div>{history.push("/")}</div>
    }
    
    return (
        <div className="content payorder-list" onClick = {() => setShowSideNav(false)}>
            <ListTitle title = "Payorder List" />
            <div className = "content-search-export">
                <ViewLimitSearch 
                searchItems = {searchPayorders} 
                searchText = {payorderState.searchTextValue} 
                changeViewLimit = {changeViewLimit} 
                />
                <Export exportToPdf = {exportToPdf} data = {payorderState.payorders}/>
                <ModalButton textContent = "Add New Payorder" displayModal = {displayModal} />
            </div>
            <div className="list">
                <table>
                    <PayorderListHeader />
                    <PayorderListBody 
                    toggleActionList = {toggleActionList}
                    displayModal = {displayModal}
                    toggleDeleteModal = {toggleDeleteModal}
                    actionListId = {payorderState.actionListId}
                    />
                </table>
            </div>
            <NextPrevView
            totalListLength = {payorderState.totalListLength} 
            limit = {payorderState.limit}
            offset = {payorderState.offset}
            showNextPrevItems = {showNextPrevPayorders}
            searchText = {payorderState.searchTextValue}
            />
            <PayorderModal 
            isModalDisplayed = {isModalDisplayed} 
            payorder = {payorder}
            error = {payorderState.formValidationError} 
            onChange = {onChange}
            addUpdatePayorder = {addUpdatePayorder}
            payorderName = {payorderName}
            successFailMessage = {payorderState.successFailMessage}
            dispatch = {dispatch}
            hideModal = {hideModal}
            date = {date}
            setDate = {setDate}
            />
            <DeleteModal 
            displayDeleteModal = {payorderState.displayPayorderDeleteModal}
            toggleDeleteModal = {toggleDeleteModal} 
            itemName = {payorderState.payorderName}
            deleteItem = {deletePayorder}
            offset = {payorderState.offset}
            limit = {payorderState.limit}
            searchText = {payorderState.searchTextValue}
            />
        </div>
    )
}

