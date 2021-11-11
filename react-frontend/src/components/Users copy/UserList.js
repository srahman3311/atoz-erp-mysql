import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useHistory } from "react-router-dom";

// Auth Middleware
import { isAuthenticated } from "../Auth/Auth";

// Stylesheet
import "./UserList.css";


// Children
import { ViewLimitSearch } from "../common-components/views/ViewLimitSearch";
import { NextPrevView } from "../common-components/views/NextPrevView";
import { Export } from "../common-components/export-buttons/Export";
import { ModalButton } from "../common-components/others/ModalButton";
import { ListTitle } from "../common-components/list-title/ListTitle";
import { UserListHeader } from "./UserListHeader";
import { UserListBody } from "./UserListBody";
import { UserModal } from "./UserModal";
import { DeleteModal } from "../common-components/delete-prompt-modal/DeleteModal";
// Contexts
import { UserContext } from "../../contexts/user_context/UserContext";
import { CommonContext } from "../../contexts/common_contexts/CommonContext";


export const UserList = () => {
    const history = useHistory();
    // Json web token is needed to be sent to backend for checking if api calls through axios are authorized or not
    const cookies = new Cookies();
    const jwtToken = cookies.get("jwtToken");
    // User Contexts
    const { 
        userState, 
        dispatch, 
        addUpdateUser, 
        changeViewLimit, 
        searchUsers, 
        showNextPrevUsers, 
        toggleDeleteModal, 
        toggleActionList, 
        deleteUser 
    } = useContext(UserContext);
    // Common Contexts
    const { setShowSideNav } = useContext(CommonContext);
    // States
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    // Need to send unique job name to backend for updating record
    const [passwordUpdateMsg, setPasswordUpdateMsg] = useState(false);
    const [userID, setUserID] = useState(0);
    // For toggling modal
    const [isModalDisplayed, setIsModalDisplayed] = useState(false);
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        username: "",
        designation: "",
        role: "",
        status: "",
        password: "",
        password2: ""
    });
    // function for fetching data at component mount and hideModal
    const fetchData = (limit, offset, searchText) => {
        const endPoint = "http://localhost:3030/api/users";
        // Search text is for re-using endPoint  
        const options = { limit, offset, searchText };
        const headers = { "x-auth-token": jwtToken };
        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: "FETCH_DATA",
                    payload: {
                        users: res.data.users,
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
        
        setUser(prev => {
            return {...prev, [name]: value}
        });
    }

    const fileHandler = (e) => {
        // if there is a file already in the file state and user didn't upload any image at second attempt then 
        // previous file state shouldn't be changed.   
        if(file && !e.target.files.length) {
            setFile(file);
            setFilename(file.name);
        } 
        // else update the file state with uploaded file
        else {
          setFile(e.target.files[0]);
          setFilename(e.target.files[0].name);
          setIsUploading(true);
        }
    }

    const displayModal = e => {
        // for updating a specific user
        if(Number(e.target.value) !== 0) {
            userState.users.map(person => {
                if(person.user_id === Number(e.target.value)) {
                    // need to send unique userID to backend for updating
                    setUserID(person.user_id);
                    setImgUrl(person.imgUrl);
                    setFile(person.imgUrl);
                    setFilename(person.filename);
                    setPasswordUpdateMsg(true);
                    setUser(previousValue => {
                        return {
                            ...previousValue,
                            first_name: person.first_name,
                            last_name: person.last_name,
                            username: person.username,
                            designation: person.designation,
                            role: person.role,
                            status: person.status
                        }
                    });
                }           
            });
        }
        
        setIsModalDisplayed(true);
        // hide the action list after user clicks on update button
        dispatch({type: "TOGGLE_ACTION_LIST", payload: 0})
    }

    const hideModal = () => {
        // to update the list with newly added item or updated item
        fetchData(userState.limit, userState.offset, userState.searchTextValue);
        setIsModalDisplayed(false);
        // set userID to 0 if modal was displayed for updating
        setUserID(0);
        setImgUrl("");
        setFile(null);
        setFilename("");
        setPasswordUpdateMsg(false);
        setIsUploading(false);
        
        // return the user to it's initial state
        setUser(previousValue => {
            return {
                ...previousValue,
                first_name: "",
                last_name: "",
                username: "",
                designation: "",
                role: "",
                status: "",
                password: "",
                password2: ""
            }
        });
    }

    function exportToPdf() {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "User Report";
        const headers = [["User ID", "First Name", "Last Name", "Username", "Designation", "Role", "Status"]];

        const data = userState.users.map(person => [
            person.user_id,
            person.first_name,
            person.last_name,
            person.username,
            person.designation,
            person.role,
            person.status
        ]);

        let content = {
            startY: 50,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("jobReport.pdf")
    }


    // if user in not authenticated redirect to home/login page
    if(!isAuthenticated()) {
        return <div>{history.push("/")}</div>
    }

    return (
        <div className="content user-list" onClick = {() => setShowSideNav(false)}>
            <ListTitle title = "User List" />
            <div className = "content-search-export">
                <ViewLimitSearch searchItems = {searchUsers} searchText = {userState.searchTextValue} changeViewLimit = {changeViewLimit} />
                <Export exportToPdf = {exportToPdf} data = {userState.users}/>
                <ModalButton textContent = "Add New User" displayModal = {displayModal} />
            </div>
            <div className="list">
                <table>
                    <UserListHeader />
                    <UserListBody 
                    toggleActionList = {toggleActionList}
                    displayModal = {displayModal}
                    toggleDeleteModal = {toggleDeleteModal}
                    actionListId = {userState.actionListId}
                    />
                </table>
            </div>
            <NextPrevView
            totalListLength = {userState.totalListLength} 
            limit = {userState.limit}
            offset = {userState.offset}
            showNextPrevItems = {showNextPrevUsers}
            searchText = {userState.searchTextValue}
            />
            <UserModal 
            isModalDisplayed = {isModalDisplayed}
            hideModal = {hideModal}
            isUploading = {isUploading}
            imgUrl = {imgUrl}
            file = {file}
            filename = {filename}
            fileHandler = {fileHandler} 
            user = {user}
            error = {userState.formValidationError} 
            onChange = {onChange}
            addUpdateUser = {addUpdateUser}
            userID = {userID}
            successFailMessage = {userState.successFailMessage}
            passwordUpdateMsg = {passwordUpdateMsg}
            dispatch = {dispatch}
            
            />
            <DeleteModal 
            displayDeleteModal = {userState.displayUserDeleteModal}
            toggleDeleteModal = {toggleDeleteModal} 
            itemName = {userState.userID}
            deleteItem = {deleteUser}
            offset = {userState.offset}
            limit = {userState.limit}
            searchText = {userState.searchTextValue}
            />
        </div>
    )
}






















































































































































































































// import React, { useEffect, useContext } from "react";
// import axios from "axios";

// import { UserContext } from "../../contexts/user_context/UserState";

// export const UserList = () => {

//     const { userData, dispatch } = useContext(UserContext);

//     useEffect(() => {
//         axios.post("http://localhost:3030/api/users", { limit: userData.limit, offset: userData.offset })
//             .then(res => {
          

//                 dispatch({
//                     type: "FETCH_DATA",
//                     payload: {
//                         users: res.data.users,
//                         userTableLength: res.data.results.length
//                     }
//                 });
//             })
//             .catch(err => console.log(err));

//     }, []);


//     return (
//         <div className="content users">
//             <h1>User List</h1>
//             <div>
//                 {userData.users.map(user => {
//                     return <p>{user.username}</p>
//                 })}
//             </div>
//         </div>
//     );
// }