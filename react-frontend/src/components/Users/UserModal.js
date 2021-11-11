import React, { useContext } from "react";

import { UserContext } from "../../contexts/user_context/UserContext";
// Children
import { ImageUploader } from "./ImageUploader";
import { Input } from "../common-components/inputs/TextInput";
import { SelectInput } from "../common-components/inputs/SelectInput";
import { UserPasswordInput } from "./UserPasswordInput";


import { PicturePreview } from "../common-components/user-info/profile-add-update/PicturePreview";
import { FileInput } from "../common-components/user-info/profile-add-update/FileInput";
import { GeneralInfo } from "../common-components/user-info/profile-add-update/GeneralInfo";
import { UsernameInfo } from "../common-components/user-info/profile-add-update/UsernameInfo";
import { PasswordInfo } from "../common-components/user-info/profile-add-update/PasswordInfo";


export const UserModal = ({
    isModalDisplayed,
    hideModal,
    isUploading,
    imgUrl,
    file,
    filename,
    fileHandler,
    onChange,
    addUpdateUser,
    user,
    userID,
    error,
    passwordUpdateMsg,
    successFailMessage,
    dispatch
}) => {

    const { userState } = useContext(UserContext);

    // Destructuring user object
    let { first_name, last_name, username, designation, role, status, password, password2 } = user;

    const roles = [
        {_id: 1, value:  "Admin"},
        {_id: 2, value:  "Manager"},
        {_id: 3, value:  "Director"}
    ];

    const statuses = [
        { _id: 1, value: "Active" },
        { _id: 2, value: "Inactive" }
    ];


    return (
        <div className="modal user-modal" style = {{display: isModalDisplayed ? "block" : "none"}}>
            <button className = "close-modal" onClick = {hideModal}>X</button>
            <div className="modal-content" id="user-modal-content">
                <button className="add-update-button" onClick = {() => addUpdateUser(file, filename, userID, user)}>Post</button>

                <div className="user-modal-content-wrapper">
                    <div className="profile-pic-edit">
                        <h2>Profile Picture</h2>
                        <PicturePreview file = {file} imgUrl = {imgUrl} filename = {filename} isUploading = {isUploading}  />
                        <FileInput file = {file} fileHandler = {fileHandler} isUploading = {isUploading} filename = {filename} />
                    </div>
            
                    <div className="user-details-edit" id="user-details-edit">
                        <h2>User Details</h2>
                        <GeneralInfo userInfo = {user} onChange = {onChange} roles = {roles} statuses = {statuses} />
                        <UsernameInfo userInfo = {user} onChange = {onChange} />
                        <PasswordInfo userInfo = {user} userID = {userID} onChange = {onChange} />
                    </div>
                </div>
            </div>
        </div>
    );

}



























