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
import { materialReducer } from "./materialReducer";
// Creating Contex
export const MaterialContext = createContext();


export const MaterialContextProvider  = ({ children }) => {

    const cookies = new Cookies();
    const jwtToken = cookies.get("jwtToken");
    const [materialState, dispatch] = useReducer(materialReducer, {
        materials: [],
        searchTextValue: "",
        limit: 15,
        offset: 0,
        totalListLength: 0,
        materialID: 0, // for toggling delete modal. 
        actionListId: 0,
        displayActionList: false,
        displayMaterialDeleteModal: false,
        formValidationError: false,
        successFailMessage: null
    })


    const addUpdateMaterial = (materialID, material) => {
      
        if(!material.name || !material.unit) {
            dispatch({ type: FORM_VALIDATION_ERROR, payload: true })
            return;
        }
        
        const endPoint = "http://localhost:3030/api/materials/add";
        const options = { materialID, material };
        const headers = {"x-auth-token": jwtToken};
        axios.post(endPoint, options, { headers })
            .then(res => dispatch({ type: ADD_UPDATE_ITEM, payload: res.data.msg }))
            .catch(err => dispatch({ type: ADD_UPDATE_ITEM, payload: err.response.data.msg }));
    }
    
    const deleteMaterial = (materialName, offset, limit, searchText) => {
       
        const endPoint = "http://localhost:3030/api/materials/delete";
        const options = { limit, offset, searchText, materialName };
        const headers = {"x-auth-token": jwtToken};

        axios.post(endPoint, options, {headers})
            .then(res => {
                dispatch({
                    type: FETCH_DATA,
                    payload: {
                        materials: res.data.materials,
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
        const endPoint = "http://localhost:3030/api/materials";
        const options = {limit: limitValue, offset: 0, searchText: materialState.searchTextValue};
        const headers = {"x-auth-token": jwtToken};

        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: CHANGE_VIEW_LIMIT,
                    payload: {
                        materials: res.data.materials,
                        totalListLength: res.data.results.length,
                        limit: Number(limitValue)
                    }
                })
            })
            .catch(err => console.log(err));
    }

    const searchMaterials = searchText => {

        const endPoint = "http://localhost:3030/api/materials";
        const options = { limit: materialState.limit, offset: 0, searchText };
        const headers = {"x-auth-token": jwtToken}

        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: SEARCH_ITEMS,
                    payload: {
                        materials: res.data.materials,
                        totalListLength: res.data.results.length,
                        searchText
                    }
                });
            })
            .catch(err => console.log(err))
    }

    const showNextPrevMaterials = (offsetValue, searchText) => {

        const endPoint = "http://localhost:3030/api/materials";
        const options = {limit: materialState.limit, offset: Number(offsetValue), searchText};
        const headers = {"x-auth-token": jwtToken};

        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: NEXT_PREV_ITEMS,
                    payload: {
                        materials: res.data.materials,
                        totalListLength: res.data.results.length,
                        offsetValue: Number(offsetValue),
                        searchText
                    }
                });
            })
            .catch(err => console.log(err))
    }

    const toggleDeleteModal = materialID => dispatch({type: TOGGLE_DELETE_MODAL, materialID});

    const toggleActionList = _id => dispatch({type: TOGGLE_ACTION_LIST, payload: Number(_id)});

    return (
        <MaterialContext.Provider 
        value = {{ 
            materialState, 
            dispatch, 
            addUpdateMaterial, 
            changeViewLimit, 
            searchMaterials, 
            showNextPrevMaterials, 
            toggleDeleteModal, 
            toggleActionList, 
            deleteMaterial 
        }}>
            { children }
        </MaterialContext.Provider>
    );
    
}














