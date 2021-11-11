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
import { userReducer } from "./userReducer";
// Creating Contex
export const UserContext = createContext();


export const UserContextProvider  = ({ children }) => {

    const cookies = new Cookies();
    const jwtToken = cookies.get("jwtToken");
    const [userState, dispatch] = useReducer(userReducer, {
        users: [],
        searchTextValue: "",
        limit: 15,
        offset: 0,
        totalListLength: 0,
        userID: 0, // for toggling delete modal. 
        actionListId: 0,
        displayActionList: false,
        displayUserDeleteModal: false,
        formValidationError: false,
        passwordError: "",
        successFailMessage: null
    })


    const addUpdateUser = (file, filename, userID, user) => {

        // Destructuring user object for validation
        const { first_name, last_name, username, designation, role, status, password, password2 } = user;

        // may be user is trying to update the user info so validation for empty passwords should not be here
        if(!first_name || !last_name || !username ) {
    
            dispatch({
               type: FORM_VALIDATION_ERROR,
               payload: {
                   validationError: true,
                   passwordError: "",
               } 
            });

            return;
        }

        // if user is not trying to update the user info then validate passwords
        if(!userID) {

            // make sure both of the password fields are filled up
            if(!password || !password2) {

                dispatch({
                    type: FORM_VALIDATION_ERROR,
                    payload: {
                        validationError: true,
                        passwordError: "",
                    } 
                 });
     
                 return;
            }

            // if passwords are not a match, throw password error
            if(password !== password2) {

                dispatch({
                    type: FORM_VALIDATION_ERROR,
                    payload: {
                        validationError: false,
                        passwordError: "Passwords didn't match",
                    } 
                 });
     
                 return;
            }
        } 

        // if user is trying to update the user info 
        if(userID) {

            // if any of the password field is filled up then user is also trying to update the password
            if(password || password2) {
                // but if user forgets to fill up any of the password field then throw validation error
                if(!password || !password2) {

                    dispatch({
                        type: FORM_VALIDATION_ERROR,
                        payload: {
                            validationError: true,
                            passwordError: "",
                        } 
                    });
                    return;
                }
                // if passwords are not a match, throw password error
                if(password !== password2) {

                    dispatch({
                        type: FORM_VALIDATION_ERROR,
                        payload: {
                            validationError: false,
                            passwordError: "Passwords didn't match",
                        } 
                    });
        
                    return;
                }
            }
        }

        // if everything is okay, go ahead and add a new user or update the existing user's info
        const data = new FormData();

        data.append("file", file);
        data.append("first_name", first_name);
        data.append("last_name", last_name);
        data.append("username", username);
        data.append("designation", designation);
        data.append("role", role);
        data.append("status", status);
        data.append("password", password);
        data.append("userID", userID);
        data.append("filename", filename);

        
        const endPoint = "http://localhost:3030/api/users/add-user";
        const headers = {"x-auth-token": jwtToken};
        // with FormData only a single object can be sent 
        // file will be available at backend with req.files object
        axios.post(endPoint, data, { headers })
            .then(res => dispatch({ type: ADD_UPDATE_ITEM, payload: res.data.msg }))
            .catch(err => dispatch({ type: ADD_UPDATE_ITEM, payload: err.response.data.msg }));
    }
    
    const deleteUser = (userID, offset, limit, searchText) => {
       
        const endPoint = "http://localhost:3030/api/users/delete";
        const options = { limit, offset, searchText, userID };
        const headers = {"x-auth-token": jwtToken};

        axios.post(endPoint, options, {headers})
            .then(res => {
                dispatch({
                    type: FETCH_DATA,
                    payload: {
                        users: res.data.users,
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
        const endPoint = "http://localhost:3030/api/users";
        const options = {limit: limitValue, offset: 0, searchText: userState.searchTextValue};
        const headers = {"x-auth-token": jwtToken};

        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: CHANGE_VIEW_LIMIT,
                    payload: {
                        users: res.data.users,
                        totalListLength: res.data.results.length,
                        limit: Number(limitValue)
                    }
                })
            })
            .catch(err => console.log(err));
    }

    const searchUsers = searchText => {

        const endPoint = "http://localhost:3030/api/users";
        const options = { limit: userState.limit, offset: 0, searchText };
        const headers = {"x-auth-token": jwtToken}

        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: SEARCH_ITEMS,
                    payload: {
                        users: res.data.users,
                        totalListLength: res.data.results.length,
                        searchText
                    }
                });
            })
            .catch(err => console.log(err))
    }

    const showNextPrevUsers = (offsetValue, searchText) => {

        const endPoint = "http://localhost:3030/api/users";
        const options = {limit: userState.limit, offset: Number(offsetValue), searchText};
        const headers = {"x-auth-token": jwtToken};

        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: NEXT_PREV_ITEMS,
                    payload: {
                        users: res.data.users,
                        totalListLength: res.data.results.length,
                        offsetValue: Number(offsetValue),
                        searchText
                    }
                });
            })
            .catch(err => console.log(err))
    }

    const toggleDeleteModal = userID => dispatch({type: TOGGLE_DELETE_MODAL, userID});

    const toggleActionList = _id => dispatch({type: TOGGLE_ACTION_LIST, payload: Number(_id)});

    return (
        <UserContext.Provider 
        value = {{ 
            userState, 
            dispatch, 
            addUpdateUser, 
            changeViewLimit, 
            searchUsers, 
            showNextPrevUsers, 
            toggleDeleteModal, 
            toggleActionList, 
            deleteUser 
        }}>
            { children }
        </UserContext.Provider>
    );
    
}














