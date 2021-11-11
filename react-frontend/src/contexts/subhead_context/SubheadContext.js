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
import { subheadReducer } from "./subheadReducer";
// Creating Contex
export const SubheadContext = createContext();


export const SubheadContextProvider  = ({ children }) => {

    const cookies = new Cookies();
    const jwtToken = cookies.get("jwtToken");
    const [subheadState, dispatch] = useReducer(subheadReducer, {
        subheads: [],
        searchTextValue: "",
        limit: 15,
        offset: 0,
        totalListLength: 0,
        subheadID: 0, // for toggling delete modal. 
        actionListId: 0,
        displayActionList: false,
        displaySubheadDeleteModal: false,
        formValidationError: false,
        successFailMessage: null
    })


    const addUpdateSubhead = (subheadID, subhead) => {
      
        if(!subhead.name) {
            dispatch({ type: FORM_VALIDATION_ERROR, payload: true })
            return;
        }
        
        const endPoint = "http://localhost:3030/api/subheads/add";
        const options = { subheadID, subhead };
        const headers = {"x-auth-token": jwtToken};
        axios.post(endPoint, options, { headers })
            .then(res => dispatch({ type: ADD_UPDATE_ITEM, payload: res.data.msg }))
            .catch(err => dispatch({ type: ADD_UPDATE_ITEM, payload: err.response.data.msg }));
    }
    
    const deleteSubhead = (subheadName, offset, limit, searchText) => {
       
        const endPoint = "http://localhost:3030/api/subheads/delete";
        const options = { limit, offset, searchText, subheadName };
        const headers = {"x-auth-token": jwtToken};

        axios.post(endPoint, options, {headers})
            .then(res => {
                dispatch({
                    type: FETCH_DATA,
                    payload: {
                        subheads: res.data.subheads,
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
        const endPoint = "http://localhost:3030/api/subheads";
        const options = {limit: limitValue, offset: 0, searchText: subheadState.searchTextValue};
        const headers = {"x-auth-token": jwtToken};

        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: CHANGE_VIEW_LIMIT,
                    payload: {
                        subheads: res.data.subheads,
                        totalListLength: res.data.results.length,
                        limit: Number(limitValue)
                    }
                })
            })
            .catch(err => console.log(err));
    }

    const searchSubheads = searchText => {

        const endPoint = "http://localhost:3030/api/subheads";
        const options = { limit: subheadState.limit, offset: 0, searchText };
        const headers = {"x-auth-token": jwtToken}

        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: SEARCH_ITEMS,
                    payload: {
                        subheads: res.data.subheads,
                        totalListLength: res.data.results.length,
                        searchText
                    }
                });
            })
            .catch(err => console.log(err))
    }

    const showNextPrevSubheads = (offsetValue, searchText) => {

        const endPoint = "http://localhost:3030/api/subheads";
        const options = {limit: subheadState.limit, offset: Number(offsetValue), searchText};
        const headers = {"x-auth-token": jwtToken};

        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: NEXT_PREV_ITEMS,
                    payload: {
                        subheads: res.data.subheads,
                        totalListLength: res.data.results.length,
                        offsetValue: Number(offsetValue),
                        searchText
                    }
                });
            })
            .catch(err => console.log(err))
    }

    const toggleDeleteModal = subheadID => dispatch({type: TOGGLE_DELETE_MODAL, subheadID});

    const toggleActionList = _id => dispatch({type: TOGGLE_ACTION_LIST, payload: Number(_id)});

    return (
        <SubheadContext.Provider 
        value = {{ 
            subheadState, 
            dispatch, 
            addUpdateSubhead, 
            changeViewLimit, 
            searchSubheads, 
            showNextPrevSubheads, 
            toggleDeleteModal, 
            toggleActionList, 
            deleteSubhead 
        }}>
            { children }
        </SubheadContext.Provider>
    );
    
}














