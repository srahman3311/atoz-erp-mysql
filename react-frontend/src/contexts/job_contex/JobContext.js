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
import { jobReducer } from "./jobReducer";
// Creating Contex
export const JobContext = createContext();


export const JobContextProvider  = ({ children }) => {

    const cookies = new Cookies();
    const jwtToken = cookies.get("jwtToken");
    const [jobState, dispatch] = useReducer(jobReducer, {
        jobs: [],
        searchTextValue: "",
        limit: 15,
        offset: 0,
        totalListLength: 0,
        jobName: null, // for toggling delete modal. 
        actionListId: 0,
        displayActionList: false,
        displayJobDeleteModal: false,
        formValidationError: false,
        successFailMessage: null
    })


    const addUpdateJob = (jobName, jobItem) => {
      
        if(!jobItem.heading || !jobItem.name || !jobItem.description || !jobItem.status) {
            dispatch({ type: FORM_VALIDATION_ERROR, payload: true })
            return;
        }
        
        const endPoint = "http://localhost:3030/api/jobs/add";
        const options = { jobItem, jobName };
        const headers = {"x-auth-token": jwtToken};
        axios.post(endPoint, options, { headers })
            .then(res => dispatch({ type: ADD_UPDATE_ITEM, payload: res.data.msg }))
            .catch(err => dispatch({ type: ADD_UPDATE_ITEM, payload: err.response.data.msg }));
    }
    
    const deleteJob = (jobName, offset, limit, searchText) => {
       
        const endPoint = "http://localhost:3030/api/jobs/delete";
        const options = { limit, offset, searchText, jobName };
        const headers = {"x-auth-token": jwtToken};

        axios.post(endPoint, options, {headers})
            .then(res => {
                dispatch({
                    type: FETCH_DATA,
                    payload: {
                        jobs: res.data.jobs,
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
        const endPoint = "http://localhost:3030/api/jobs";
        const options = {limit: limitValue, offset: 0, searchText: jobState.searchTextValue};
        const headers = {"x-auth-token": jwtToken};

        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: CHANGE_VIEW_LIMIT,
                    payload: {
                        jobs: res.data.jobs,
                        totalListLength: res.data.results.length,
                        limit: Number(limitValue)
                    }
                })
            })
            .catch(err => console.log(err));
    }

    const searchJobs = searchText => {

        const endPoint = "http://localhost:3030/api/jobs";
        const options = { limit: jobState.limit, offset: 0, searchText };
        const headers = {"x-auth-token": jwtToken}

        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: SEARCH_ITEMS,
                    payload: {
                        jobs: res.data.jobs,
                        totalListLength: res.data.results.length,
                        searchText
                    }
                });
            })
            .catch(err => console.log(err))
    }

    const showNextPrevJobs = (offsetValue, searchText) => {

        const endPoint = "http://localhost:3030/api/jobs";
        const options = {limit: jobState.limit, offset: Number(offsetValue), searchText};
        const headers = {"x-auth-token": jwtToken};

        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: NEXT_PREV_ITEMS,
                    payload: {
                        jobs: res.data.jobs,
                        totalListLength: res.data.results.length,
                        offsetValue: Number(offsetValue),
                        searchText
                    }
                });
            })
            .catch(err => console.log(err))
    }

    const toggleDeleteModal = jobName => dispatch({type: TOGGLE_DELETE_MODAL, jobName});

    const toggleActionList = _id => dispatch({type: TOGGLE_ACTION_LIST, payload: Number(_id)});

    return (
        <JobContext.Provider 
        value = {{ 
            jobState, 
            dispatch, 
            addUpdateJob, 
            changeViewLimit, 
            searchJobs, 
            showNextPrevJobs, 
            toggleDeleteModal, 
            toggleActionList, 
            deleteJob 
        }}>
            { children }
        </JobContext.Provider>
    );
    
}














