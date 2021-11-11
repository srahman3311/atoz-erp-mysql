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
import { payorderReducer } from "./payorderReducer";
// Creating Contex
export const PayorderContext = createContext();


export const PayorderContextProvider  = ({ children }) => {

    const cookies = new Cookies();
    const jwtToken = cookies.get("jwtToken");
    const [payorderState, dispatch] = useReducer(payorderReducer, {
        payorders: [],
        searchTextValue: "",
        limit: 15,
        offset: 0,
        totalListLength: 0,
        payorderName: null, // for toggling delete modal. 
        actionListId: 0,
        displayActionList: false,
        displayPayorderDeleteModal: false,
        formValidationError: false,
        successFailMessage: null
    })


    const addUpdatePayorder = (date, payorderName, payorder) => {
        console.log(payorderName, payorder, date);
    
        const { payorder_no, bank_name, branch_name, receiver_name, total_amount, remarks } = payorder;
      
        if(date === null || !payorder_no || !bank_name || !branch_name || !receiver_name || !total_amount || !remarks) {
            dispatch({ type: FORM_VALIDATION_ERROR, payload: true })
            return;
        }
        
        const endPoint = "http://localhost:3030/api/payorders/add";
        const options = { date, payorder, payorderName };
        const headers = {"x-auth-token": jwtToken};
        axios.post(endPoint, options, { headers })
            .then(res => dispatch({ type: ADD_UPDATE_ITEM, payload: res.data.msg }))
            .catch(err => dispatch({ type: ADD_UPDATE_ITEM, payload: err.response.data.msg }));
    }
    
    const deletePayorder = (payorderName, offset, limit, searchText) => {
       
        const endPoint = "http://localhost:3030/api/payorders/delete";
        const options = { limit, offset, searchText, payorderName };
        const headers = {"x-auth-token": jwtToken};

        axios.post(endPoint, options, {headers})
            .then(res => {
                dispatch({
                    type: FETCH_DATA,
                    payload: {
                        payorders: res.data.payorders,
                        totalListLength: res.data.results.length,
                        offset,
                        limit, 
                        searchText
                    }
                });
            })
            .catch(err => alert(err.response.data.msg));
    }

    const changeViewLimit = limitValue => {
        const endPoint = "http://localhost:3030/api/payorders";
        const options = {limit: limitValue, offset: 0, searchText: payorderState.searchTextValue};
        const headers = {"x-auth-token": jwtToken};

        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: CHANGE_VIEW_LIMIT,
                    payload: {
                        payorders: res.data.payorders,
                        totalListLength: res.data.results.length,
                        limit: Number(limitValue)
                    }
                })
            })
            .catch(err => console.log(err));
    }

    const searchPayorders = searchText => {

        const endPoint = "http://localhost:3030/api/payorders";
        const options = { limit: payorderState.limit, offset: 0, searchText };
        const headers = {"x-auth-token": jwtToken}

        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: SEARCH_ITEMS,
                    payload: {
                        payorders: res.data.payorders,
                        totalListLength: res.data.results.length,
                        searchText
                    }
                });
            })
            .catch(err => console.log(err))
    }

    const showNextPrevPayorders = (offsetValue, searchText) => {

        const endPoint = "http://localhost:3030/api/payorders";
        const options = {limit: payorderState.limit, offset: Number(offsetValue), searchText};
        const headers = {"x-auth-token": jwtToken};

        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: NEXT_PREV_ITEMS,
                    payload: {
                        payorders: res.data.payorders,
                        totalListLength: res.data.results.length,
                        offsetValue: Number(offsetValue),
                        searchText
                    }
                });
            })
            .catch(err => console.log(err))
    }

    const toggleDeleteModal = payorderName => dispatch({type: TOGGLE_DELETE_MODAL, payorderName});

    const toggleActionList = _id => dispatch({type: TOGGLE_ACTION_LIST, payload: Number(_id)});

    return (
        <PayorderContext.Provider 
        value = {{ 
            payorderState, 
            dispatch, 
            addUpdatePayorder, 
            changeViewLimit, 
            searchPayorders, 
            showNextPrevPayorders, 
            toggleDeleteModal, 
            toggleActionList, 
            deletePayorder 
        }}>
            { children }
        </PayorderContext.Provider>
    );
    
}














