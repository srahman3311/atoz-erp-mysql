import React, { createContext, useReducer } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
// Types
import { 
    FETCH_DATA, 
    ADD_UPDATE_ITEM, 
    CHANGE_VIEW_LIMIT, 
    SEARCH_ITEMS, 
    NEXT_PREV_ITEMS, 
    TOGGLE_ACTION_LIST, 
    TOGGLE_DELETE_MODAL,
    FORM_VALIDATION_ERROR  
} from "../types/types";
// Reducer
import { expenseReducer } from "./expenseReducer";

// Creating Contex
export const ExpenseContext = createContext();



export const ExpenseContextProvider = ({ children }) => {

    const cookies = new Cookies();
    const jwtToken = cookies.get("jwtToken");
    const [expenseState, dispatch] = useReducer(expenseReducer, {
        expenses: [],
        searchTextValue: "",
        limit: 15,
        offset: 0,
        totalListLength: 0,
        expenseID: 0, // for toggling delete modal. 
        actionListId: 0,
        displayExpenseModal: false,
        displayActionList: false,
        displayExpenseDeleteModal: false,
        formValidationError: false,
        successFailMessage: null
    })


    const addUpdateExpense = (expenseID, expense, date, materialUnit, spent_by) => {
        // Destructuring expense object 
        const { job, subhead, material, description, unit_price, qty } = expense;
        // Form validation
        if(!job || !subhead || !material || !description || !unit_price || !qty || date === null) {
            dispatch({ type: FORM_VALIDATION_ERROR, payload: true })
            return;
        }
        
        const endPoint = "http://localhost:3030/api/expenses/add";
        const options = { expenseID, expense, date, materialUnit, spent_by };
        const headers = {"x-auth-token": jwtToken};
        axios.post(endPoint, options, { headers })
            .then(res => dispatch({ type: ADD_UPDATE_ITEM, payload: res.data.msg }))
            .catch(err => dispatch({ type: ADD_UPDATE_ITEM, payload: err.response.data.msg }));
    }
    
    const deleteExpense = (expenseName, offset, limit, searchText) => {
        console.log(expenseName);
       
        const endPoint = "http://localhost:3030/api/expenses/delete";
        const options = { limit, offset, searchText, expenseName };
        const headers = {"x-auth-token": jwtToken};

        axios.post(endPoint, options, {headers})
            .then(res => {
                dispatch({
                    type: FETCH_DATA,
                    payload: {
                        expenses: res.data.expenses,
                        totalListLength: res.data.results.length,
                        offset,
                        limit, 
                        searchText,
                    }
                });
            })
            .catch(err => alert(err.response.data.msg));
    }

    const changeViewLimit = limitValue => {
        const endPoint = "http://localhost:3030/api/expenses";
        const options = {limit: limitValue, offset: 0, searchText: expenseState.searchTextValue};
        const headers = {"x-auth-token": jwtToken};

        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: CHANGE_VIEW_LIMIT,
                    payload: {
                        expenses: res.data.expenses,
                        totalListLength: res.data.results.length,
                        limit: Number(limitValue)
                    }
                })
            })
            .catch(err => console.log(err));
    }

    const searchExpenses = searchText => {
        const endPoint = "http://localhost:3030/api/expenses";
        const options = { limit: expenseState.limit, offset: 0, searchText };
        const headers = {"x-auth-token": jwtToken}

        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: SEARCH_ITEMS,
                    payload: {
                        expenses: res.data.expenses,
                        totalListLength: res.data.results.length,
                        searchText
                    }
                });
            })
            .catch(err => console.log(err))
    }

    const showNextPrevExpenses = (offsetValue, searchText) => {
        
        const endPoint = "http://localhost:3030/api/expenses";
        const options = {limit: expenseState.limit, offset: offsetValue, searchText};
        const headers = {"x-auth-token": jwtToken};

        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: NEXT_PREV_ITEMS,
                    payload: {
                        expenses: res.data.expenses,
                        totalListLength: res.data.results.length,
                        offsetValue: Number(offsetValue),
                        searchText
                    }
                });
            })
            .catch(err => console.log(err))
    }

    const toggleDeleteModal = expenseID => dispatch({type: TOGGLE_DELETE_MODAL, expenseID});

    const toggleActionList = _id => dispatch({type: TOGGLE_ACTION_LIST, payload: Number(_id)});





    return (
        <ExpenseContext.Provider value={{
            expenseState, 
            dispatch,
            addUpdateExpense, 
            changeViewLimit, 
            searchExpenses, 
            showNextPrevExpenses, 
            toggleDeleteModal, 
            toggleActionList, 
            deleteExpense 
        }}>
            { children }
        </ExpenseContext.Provider>
    );
   
}