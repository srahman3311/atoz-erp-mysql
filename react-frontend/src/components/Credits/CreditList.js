import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";

// For Dynamic PDF Generation
import jsPDF from "jspdf";
import "jspdf-autotable";

// Auth Middleware
import { isAuthenticated } from "../Auth/Auth";

// Children
import { ViewLimitSearch } from "../common-components/views/ViewLimitSearch";
import { NextPrevView } from "../common-components/views/NextPrevView";
import { Export } from "../common-components/export-buttons/Export";
import { ModalButton } from "../common-components/others/ModalButton";
import { ListTitle } from "../common-components/list-title/ListTitle";
import { CreditListHeader } from "./CreditListHeader";
import { CreditListBody } from "./CreditListBody";
import { CreditModal } from "./CreditModal";
import { DeleteModal } from "../common-components/delete-prompt-modal/DeleteModal";

// Contexts
import { CreditContext } from "../../contexts/credit_context/CreditContext";
import { CommonContext } from "../../contexts/common_contexts/CommonContext";


export const CreditList = () => {

    const history = useHistory();

    // json web token is needed to be sent to backend to make sure that api calls through axios are authorized
    const cookies = new Cookies();
    const jwtToken = cookies.get("jwtToken");

    // Contexts
    const { 
        creditState, 
        dispatch, 
        addUpdateCredit, 
        changeViewLimit, 
        searchCredits, 
        showNextPrevCredits, 
        toggleDeleteModal, 
        toggleActionList, 
        deleteCredit 
    } = useContext(CreditContext);
    const { setShowSideNav } = useContext(CommonContext);

    // States
    const [list, setList] = useState({ job: [] });
    const [date, setDate] = useState(null);
    // const [materialUnit, setMaterialUnit] = useState("");
    const [isJobListVisible, setIsJobListVisible] = useState(false);
    // const [isSubheadListVisible, setIsSubheadListVisible] = useState(false);
    // const [isMaterialListVisible, setIsMaterialListVisible] = useState(false);

    // Need to send a unique credit ID to backend for updating a specific record
    const [creditID, setCreditID] = useState(0);

    // For toggling modal
    const [isModalDisplayed, setIsModalDisplayed] = useState(false);
    
    const [credit, setCredit] = useState({
        job: "",
        amount: 0,
        remarks: ""
    });

    // function for fetching data at component mount and hideModal
    const fetchData = (limit, offset, searchText) => {
        const endPoint = "http://localhost:3030/api/credits";
        // Search text is for re-using endPoint  
        const options = { limit, offset, searchText };
        const headers = { "x-auth-token": jwtToken };
        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: "FETCH_DATA",
                    payload: {
                        credits: res.data.credits,
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
        // when component mounts or remounts start everything from the beginning
        fetchData(15, 0, "");
    }, []);

    // Input onChange event handler function
    function onChange(e) {

        const name = e.target.name;
        const value = e.target.value;
      
        setCredit(prev => {
            return {...prev, [name]: value}
        });

        if(name === "job") {

            setIsJobListVisible(true);

            const url = `http://localhost:3030/api/${name}s`;

            axios.post(url, {keyword: e.target.value}, {headers: {"x-auth-token": jwtToken}})
            .then(res => {

                setList(prev => {

                    return { ...prev, [name]: res.data };

                });
            })
            .catch(err => console.log(err));
        }
    }



    function selectItem(e) {

        const className = e.target.className;
        const content = e.target.textContent;

        setCredit(prev => {
            return {...prev, [className]: content}
        });

        if(className === "job") setIsJobListVisible(false);
    }


    const displayModal = e => {
        // hide the action list after user clicks on update button
        dispatch({type: "TOGGLE_ACTION_LIST", payload: 0});
        setIsModalDisplayed(true);
        // for updating a specific credit
        if(e.target.value !== "") {
            creditState.credits.map(item => {
                if(item.serial_no === Number(e.target.value)) {
                    // need to send unique credit ID to backend for updating
                    setCreditID(item.serial_no);
                    setDate(new Date(item.date_time));
                    setCredit(previousValue => {
                        return {
                            ...previousValue,
                            job: item.job,
                            amount: item.amount,
                            remarks: item.remarks
                        }
                    });
                }           
            });
        }
    }

    const hideModal = () => {
        setDate(null);
        setIsModalDisplayed(false);
        // set credit ID to 0 if modal was displayed for updating
        setCreditID(0);
        // return the credit to it's initial state
        setCredit(previousValue => {
            return {
                ...previousValue,
                job: "",
                amount: 0,
                remarks: ""
            }
        });
        // to update the list with newly added item or updated item
        fetchData(creditState.limit, creditState.offset, creditState.searchTextValue);
    }

    function exportToPdf() {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "Credit Report";
        const headers = [
            [
                "Serial No", 
                "Date", 
                "Job", 
                "Amount", 
                "Remarks" 
            ]
        ];

        const data = creditState.credits.map(credit => [
            credit.serial_no,
            credit.date_time,
            credit.job,
            credit.amount,
            credit.remarks
        ]);

        let content = {
            startY: 50,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("creditReport.pdf")
    }

    // if user in not authenticated redirect to home/login page
    if(!isAuthenticated()) {
        return <div>{history.push("/")}</div>
    }
    
    return (
        <div className="content credit-list" onClick = {() => setShowSideNav(false)}>
            <ListTitle title = "Credit List" />
            <div className = "content-search-export">
                <ViewLimitSearch 
                searchItems = {searchCredits} 
                searchText = {creditState.searchTextValue} 
                changeViewLimit = {changeViewLimit} 
                />
                <Export exportToPdf = {exportToPdf} data = {creditState.credits}/>
                <ModalButton textContent = "Add New Credit" displayModal = {displayModal} />
            </div>
            <div className="list">
                <table>
                    <CreditListHeader />
                    <CreditListBody 
                    toggleActionList = {toggleActionList}
                    displayModal = {displayModal}
                    toggleDeleteModal = {toggleDeleteModal}
                    actionListId = {creditState.actionListId}
                    />
                </table>
            </div>
            <NextPrevView
            totalListLength = {creditState.totalListLength} 
            limit = {creditState.limit}
            offset = {creditState.offset}
            showNextPrevItems = {showNextPrevCredits}
            searchText = {creditState.searchTextValue}
            />
          

            <CreditModal
            isModalDisplayed = {isModalDisplayed} 
            credit = {credit}
            addUpdateCredit = {addUpdateCredit}
            creditID = {creditID}
            successFailMessage = {creditState.successFailMessage}
            error = {creditState.formValidationError}
            dispatch = {dispatch}
            hideModal = {hideModal}
            list = {list} 
            onChange = {onChange}
            selectItem = {selectItem}
            date = {date}
            setDate = {setDate}
            isJobListVisible = {isJobListVisible}
            />

            <DeleteModal 
            displayDeleteModal = {creditState.displayCreditDeleteModal}
            toggleDeleteModal = {toggleDeleteModal} 
            itemName = {creditState.creditID} // Needs Attention
            deleteItem = {deleteCredit}
            offset = {creditState.offset}
            limit = {creditState.limit}
            searchText = {creditState.searchTextValue}
            />
        </div>
    )
}

