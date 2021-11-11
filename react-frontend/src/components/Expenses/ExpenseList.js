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
import { ExpenseListHeader } from "./ExpenseListHeader";
import { ExpenseListBody } from "./ExpenseListBody";
import { ExpenseModal } from "./ExpenseModal";
import { DeleteModal } from "../common-components/delete-prompt-modal/DeleteModal";

// Contexts
import { ExpenseContext } from "../../contexts/expense_context/ExpenseContext";
import { CommonContext } from "../../contexts/common_contexts/CommonContext";


export const ExpenseList = () => {

    const history = useHistory();

    // json web token is needed to be sent to backend to make sure that api calls through axios are authorized
    const cookies = new Cookies();
    const jwtToken = cookies.get("jwtToken");

    // Contexts
    const { 
        expenseState, 
        dispatch, 
        addUpdateExpense, 
        changeViewLimit, 
        searchExpenses, 
        showNextPrevExpenses, 
        toggleDeleteModal, 
        toggleActionList, 
        deleteExpense 
    } = useContext(ExpenseContext);
    const { setShowSideNav } = useContext(CommonContext);

    // States
    const [list, setList] = useState({job: [], subhead: [], material: []});
    const [date, setDate] = useState(null);
    const [materialUnit, setMaterialUnit] = useState("");
    const [isJobListVisible, setIsJobListVisible] = useState(false);
    const [isSubheadListVisible, setIsSubheadListVisible] = useState(false);
    const [isMaterialListVisible, setIsMaterialListVisible] = useState(false);

    // Need to send a unique expense ID to backend for updating a specific record
    const [expenseID, setExpenseID] = useState(0);

    // For toggling modal
    const [isModalDisplayed, setIsModalDisplayed] = useState(false);
    
    const [expense, setExpense] = useState({
        job: "",
        subhead: "",
        material: "",
        description: "",
        qty: 0,
        unit_price: 0,
        discount: 0,
        upcharge: 0,
        status: ""
    });

    // function for fetching data at component mount and hideModal
    const fetchData = (limit, offset, searchText) => {
        const endPoint = "http://localhost:3030/api/expenses";
        // Search text is for re-using endPoint  
        const options = { limit, offset, searchText };
        const headers = { "x-auth-token": jwtToken };
        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: "FETCH_DATA",
                    payload: {
                        expenses: res.data.expenses,
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
      
        if(name === "material") setMaterialUnit("");

        setExpense(prev => {
            return {...prev, [name]: value}
        });

        if(name === "job") setIsJobListVisible(true);
        if(name === "subhead") setIsSubheadListVisible(true);
        if(name === "material") setIsMaterialListVisible(true);

        if(name === "job" || name === "subhead" || name === "material") {

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

        console.log(e.target);
        const className = e.target.className;
        const content = e.target.textContent;

        setExpense(prev => {
            return {...prev, [className]: content}
        });

        // Input value of unit field
        if(className === "material") {
            list.material.map(item => {
                if(item.name === content) {
                    setMaterialUnit(item.unit);
                }
            });
        }
    

        if(className === "job") setIsJobListVisible(false);
        if(className === "subhead") setIsSubheadListVisible(false);
        if(className === "material") setIsMaterialListVisible(false);
    }

    const displayModal = e => {
        // hide the action list after user clicks on update button
        dispatch({type: "TOGGLE_ACTION_LIST", payload: 0});
        setIsModalDisplayed(true);
        // for updating a specific job
        if(e.target.value !== "") {
            expenseState.expenses.map(item => {
                if(item.serial_no === Number(e.target.value)) {
                    // need to send unique job name to backend for updating
                    setExpenseID(item.serial_no);
                    setDate(new Date(item.date_time));
                    setMaterialUnit(item.unit);
                    setExpense(previousValue => {
                        return {
                            ...previousValue,
                            job: item.job,
                            subhead: item.subhead,
                            material: item.material_name,
                            description: item.description,
                            qty: item.qty,
                            unit_price: item.unit_price,
                            discount: item.discount,
                            upcharge: item.upcharge,
                            status: item.status
                        }
                    });
                }           
            });
        }
    }

    const hideModal = () => {
        setDate(null);
        setIsModalDisplayed(false);
        // set jobName to null if modal was displayed for updating
        setExpenseID(0);
        // return the job to it's initial state
        setExpense(previousValue => {
            return {
                ...previousValue,
                job: "",
                subhead: "",
                material: "",
                description: "",
                qty: "",
                unit_price: "",
                discount: 0,
                upcharge: 0,
                status: ""
            }
        });
        // to update the list with newly added item or updated item
        fetchData(expenseState.limit, expenseState.offset, expenseState.searchTextValue);
    }

    function exportToPdf() {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "Expense Report";
        const headers = [
            [
                "Serial No", 
                "Date", 
                "Job", 
                "Subhead", 
                "Material", 
                "Description", 
                "Qty", 
                "Unit", 
                "Unit Price",
                "Discount",
                "Upcharge",
                "Total",
                "Material Status",
                "Approval Status",
                "Status",
                "Spent By" 
            ]
        ];

        const data = expenseState.expenses.map(expense => [
            expense.serial_no,
            expense.date_time,
            expense.job,
            expense.subhead,
            expense.material_name,
            expense.description,
            expense.qty,
            expense.unit,
            expense.unit_price,
            expense.discount,
            expense.upcharge,
            expense.total,
            expense.material_status,
            expense.approval_status,
            expense.status,
            expense.spent_by
        ]);

        let content = {
            startY: 50,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("expenseReport.pdf")
    }

    // if user in not authenticated redirect to home/login page
    if(!isAuthenticated()) {
        return <div>{history.push("/")}</div>
    }
    
    return (
        <div className="content expense-list" onClick = {() => setShowSideNav(false)}>
            <ListTitle title = "Expense List" />
            <div className = "content-search-export">
                <ViewLimitSearch 
                searchItems = {searchExpenses} 
                searchText = {expenseState.searchTextValue} 
                changeViewLimit = {changeViewLimit} 
                />
                <Export exportToPdf = {exportToPdf} data = {expenseState.expenses}/>
                <ModalButton textContent = "Add New Expense" displayModal = {displayModal} />
            </div>
            <div className="list">
                <table>
                    <ExpenseListHeader />
                    <ExpenseListBody 
                    toggleActionList = {toggleActionList}
                    displayModal = {displayModal}
                    toggleDeleteModal = {toggleDeleteModal}
                    actionListId = {expenseState.actionListId}
                    />
                </table>
            </div>
            <NextPrevView
            totalListLength = {expenseState.totalListLength} 
            limit = {expenseState.limit}
            offset = {expenseState.offset}
            showNextPrevItems = {showNextPrevExpenses}
            searchText = {expenseState.searchTextValue}
            />
          

            <ExpenseModal
            isModalDisplayed = {isModalDisplayed} 
            expense = {expense}
            addUpdateExpense = {addUpdateExpense}
            expenseID = {expenseID}
            successFailMessage = {expenseState.successFailMessage}
            error = {expenseState.formValidationError}
            dispatch = {dispatch}
            hideModal = {hideModal}
            materialUnit = {materialUnit}
            list = {list} 
            onChange = {onChange}
            selectItem = {selectItem}
            date = {date}
            setDate = {setDate}
            isJobListVisible = {isJobListVisible}
            isMaterialListVisible = {isMaterialListVisible}
            isSubheadListVisible = {isSubheadListVisible}
            />

            <DeleteModal 
            displayDeleteModal = {expenseState.displayExpenseDeleteModal}
            toggleDeleteModal = {toggleDeleteModal} 
            itemName = {expenseState.expenseID} // Needs Attention
            deleteItem = {deleteExpense}
            offset = {expenseState.offset}
            limit = {expenseState.limit}
            searchText = {expenseState.searchTextValue}
            />
        </div>
    )
}

