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
import { creditReducer } from "./creditReducer";

// Creating Contex
export const CreditContext = createContext();



export const CreditContextProvider = ({ children }) => {

    const cookies = new Cookies();
    const jwtToken = cookies.get("jwtToken");
    const [creditState, dispatch] = useReducer(creditReducer, {
        credits: [],
        searchTextValue: "",
        limit: 15,
        offset: 0,
        totalListLength: 0,
        creditID: 0, // for toggling delete modal. 
        actionListId: 0,
        displayCreditModal: false,
        displayActionList: false,
        displayCreditDeleteModal: false,
        formValidationError: false,
        successFailMessage: null
    })


    const addUpdateCredit = (creditID, credit, date) => {

        const { job, amount, remarks } = credit;
        
        // Form validation
        if(!job || !amount || !remarks || date === null) {
            dispatch({ type: FORM_VALIDATION_ERROR, payload: true })
            return;
        }
        
        const endPoint = "http://localhost:3030/api/credits/add";
        const options = { creditID, credit, date };
        const headers = {"x-auth-token": jwtToken};
        axios.post(endPoint, options, { headers })
            .then(res => dispatch({ type: ADD_UPDATE_ITEM, payload: res.data.msg }))
            .catch(err => dispatch({ type: ADD_UPDATE_ITEM, payload: err.response.data.msg }));
    }
    
    const deleteCredit = (creditName, offset, limit, searchText) => {
       
        const endPoint = "http://localhost:3030/api/credits/delete";
        const options = { limit, offset, searchText, creditName };
        const headers = {"x-auth-token": jwtToken};

        axios.post(endPoint, options, {headers})
            .then(res => {
                dispatch({
                    type: FETCH_DATA,
                    payload: {
                        credits: res.data.credits,
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
        const endPoint = "http://localhost:3030/api/credits";
        const options = {limit: limitValue, offset: 0, searchText: creditState.searchTextValue};
        const headers = {"x-auth-token": jwtToken};

        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: CHANGE_VIEW_LIMIT,
                    payload: {
                        credits: res.data.credits,
                        totalListLength: res.data.results.length,
                        limit: Number(limitValue)
                    }
                })
            })
            .catch(err => console.log(err));
    }

    const searchCredits = searchText => {
        const endPoint = "http://localhost:3030/api/credits";
        const options = { limit: creditState.limit, offset: 0, searchText };
        const headers = {"x-auth-token": jwtToken}

        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: SEARCH_ITEMS,
                    payload: {
                        credits: res.data.credits,
                        totalListLength: res.data.results.length,
                        searchText
                    }
                });
            })
            .catch(err => console.log(err))
    }

    const showNextPrevCredits = (offsetValue, searchText) => {
        
        const endPoint = "http://localhost:3030/api/credits";
        const options = {limit: creditState.limit, offset: offsetValue, searchText};
        const headers = {"x-auth-token": jwtToken};

        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: NEXT_PREV_ITEMS,
                    payload: {
                        credits: res.data.credits,
                        totalListLength: res.data.results.length,
                        offsetValue: Number(offsetValue),
                        searchText
                    }
                });
            })
            .catch(err => console.log(err))
    }

    const toggleDeleteModal = creditID => dispatch({type: TOGGLE_DELETE_MODAL, creditID});

    const toggleActionList = _id => dispatch({type: TOGGLE_ACTION_LIST, payload: Number(_id)});





    return (
        <CreditContext.Provider value={{
            creditState, 
            dispatch,
            addUpdateCredit, 
            changeViewLimit, 
            searchCredits, 
            showNextPrevCredits, 
            toggleDeleteModal, 
            toggleActionList, 
            deleteCredit 
        }}>
            { children }
        </CreditContext.Provider>
    );
   
}