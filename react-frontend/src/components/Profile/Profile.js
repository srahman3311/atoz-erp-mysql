import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

// useParams is for accessing dynamic user details
import { useHistory, useParams } from "react-router-dom";

// Auth Middleware
import { isAuthenticated } from "../Auth/Auth";

// Children
import { ProfileImage } from "../common-components/user-info/profile-info/ProfileImage";
import { UserDetails } from "../common-components/user-info/profile-info/UserDetails";
import { PicturePreview } from "../common-components/user-info/profile-add-update/PicturePreview";
import { FileInput } from "../common-components/user-info/profile-add-update/FileInput";
import { GeneralInfo } from "../common-components/user-info/profile-add-update/GeneralInfo";
import { UsernameInfo } from "../common-components/user-info/profile-add-update/UsernameInfo";
import { PasswordInfo } from "../common-components/user-info/profile-add-update/PasswordInfo";
// Contexts
import { UserContext } from "../../contexts/user_context/UserContext";
import { CommonContext } from "../../contexts/common_contexts/CommonContext";

// Styling
import "./Profile.css";


export const Profile = () => {

    // slug here accesses the dynamic username
    let { slug } = useParams();
    const history = useHistory();
    const { userState, addUpdateUser, dispatch } = useContext(UserContext);
    const { setShowSideNav, setShowProfileMenu } = useContext(CommonContext);

    //
    const roles = [{ _id: 1, value:  "Admin" }, { _id: 2, value:  "Manager" }, { _id: 3, value:  "Director" }];
    const statuses = [{ _id: 1, value: "Active" }, { _id: 2, value: "Inactive" }];

    

    const [user, setUser] = useState({});
    const [userID, setUserID] = useState(0);
    const [userInfo, setUserInfo] = useState({
        first_name: "",
        last_name: "",
        username: "",
        designation: "",
        role: "",
        status: "",
        password: "",
        password2: ""
    });
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Dependency editMode is used here to repopulate the userInfo object with data fetched from the backend. 
    useEffect(() => {

        // To hide the profile menu
        setShowProfileMenu(false);

        axios.post("http://localhost:3030/api/users/user", {username: slug})
            .then(res => {

                setUser(res.data);

                setUserInfo(prevValue => {
                    return {
                        ...prevValue,
                        first_name: res.data.first_name,
                        last_name: res.data.last_name,
                        username: res.data.username,
                        designation: res.data.designation,
                        role: res.data.role,
                        status: res.data.status,
                    };
                });

                setFile(res.data.imgUrl);
                setFilename(res.data.filename);
                setUserID(Number(res.data.user_id));
            })
            .catch(err => console.log(err));
            
    }, [editMode]);

    function onChange(e) {

        const name = e.target.name;
        const value = e.target.value;

        setUserInfo(prev => {
            return { ...prev, [name]: value };
        });

    }

    const fileHandler = event => {

        const uploadedFile = event.target.files;
        // if there is a file already in the file state and user didn't upload any image at second attempt then 
        // previous file state shouldn't be changed.   
        if(file && !uploadedFile.length) {
            setFile(file);
            setFilename(file.name);
        } 
        // else update the file state with uploaded file
        else {
            setFile(uploadedFile[0]);
            setFilename(uploadedFile[0].name);
            setIsUploading(true);
        }
    }

    const hideEditMode = event => {

        dispatch({
            type: "FORM_VALIDATION_ERROR",
            payload: {
                validationError: false,
                passwordError: ""
            }
        });

        setUserInfo(prevValue => {
            return {
                ...prevValue,
                password: "",
                password2: ""
            };
        });

        setFile(null);
        setIsUploading(false);
        setEditMode(false);

    }
    
    // if user in not authenticated redirect to home/login page
    if(!isAuthenticated()) {
        return <div>{history.push("/")}</div>
    }

    return (
        <div className="content user-profile" onClick = {() => setShowSideNav(false)}>

            <div className = "profile-container" style = {{display: editMode ? "none" : "flex"}}>
                <button id="profile-edit-button" value = {user.username} onClick = {() => setEditMode(true)}>Edit</button>
                <ProfileImage user = {user} />
                <UserDetails user = {user} />
            </div>

            <div className="edit-mode" style ={{display: editMode ? "flex" : "none"}}>
                <div className="profile-pic-edit">
                    <h2>Profile Picture</h2>
                    <PicturePreview file = {file} imgUrl = {user.imgUrl} filename = {filename} isUploading = {isUploading}  />
                    <FileInput file = {file} fileHandler = {fileHandler} isUploading = {isUploading} filename={user.filename} />
                </div>
        
                <div className="user-details-edit" id="user-details-edit">
                    <h2>User Details</h2>
                    <GeneralInfo userInfo = {userInfo} onChange = {onChange} roles = {roles} statuses = {statuses} />
                    <UsernameInfo userInfo = {userInfo} onChange = {onChange} />
                    <PasswordInfo userInfo = {userInfo} onChange = {onChange} userID = {userID} />
                    <div className="edit-mode-button">
                        <button onClick = {hideEditMode}>Cancel/Close</button>
                        <button onClick = {() => addUpdateUser(file, filename, userID, userInfo )}>Update</button>
                    </div>
                </div>
            </div>
            
        </div>
      );

}