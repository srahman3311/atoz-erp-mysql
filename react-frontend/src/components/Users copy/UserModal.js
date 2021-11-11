import React, { useContext } from "react";

import { UserContext } from "../../contexts/user_context/UserContext";
// Children
import { ImageUploader } from "./ImageUploader";
import { Input } from "../common-components/inputs/Input";
import { SelectInput } from "../common-components/inputs/SelectInput";
import { UserPasswordInput } from "./UserPasswordInput";


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

    const selectRoleValues = [
        {_id: 1, value:  "Admin"},
        {_id: 2, value:  "Manager"},
        {_id: 3, value:  "Director"}
    ];

    const selectStatusValues = [
        { _id: 1, value: "Active" },
        { _id: 2, value: "Inactive" }
    ];


    return (
        <div className="modal user-modal" style = {{display: isModalDisplayed ? "block" : "none"}}>
            <button id = "close-modal" onClick = {hideModal}>X</button>
            <div className="user-modal-content" id="user-modal-content">
                <div className="success-fail-message" style ={{display: successFailMessage !== null ? "flex": "none"}}>
                    <p>{ successFailMessage }</p>
                    <button id="message-close" onClick = {() => dispatch({type: "ADD_UPDATE_ITEM"})}>X</button>
                </div>
                <div className="user-info">
                    <div className="image-and-basic">
                        <div className="user-image">
                            <ImageUploader 
                            isUploading = {isUploading} 
                            imgUrl = {imgUrl} 
                            file = {file} 
                            filename = {filename} 
                            fileHandler = {fileHandler} 
                            />
                        </div>
                        <div className="basic-info-container">
                            <div className="basic-info">
                                <h3>Basic Information</h3>
                                <div className="password-error-message" style = {{display: userState.passwordError ? "block" : "none"}}>
                                    <p style = {{color: "red"}}>{userState.passwordError}</p>
                                </div>
                                <div className="password-update-msg" 
                                style={{display: passwordUpdateMsg ? "block" : "none", backgroundColor: "red"}}>
                                    <p style={{fontSize: "0.9rem"}}>Leave the password fields empty if not needed to update</p>
                                </div>
                                <Input label="Username" name="username" value={username} error={error} onChange={onChange} />
                                <UserPasswordInput 
                                placeholder = "Password"
                                name="password" 
                                value={password} 
                                error={error}
                                passwordError = {userState.passwordError} 
                                onChange={onChange} 
                                />
                                <UserPasswordInput 
                                placeholder = "Confirm Password"
                                name="password2" 
                                value={user.password2} 
                                error={error} 
                                passwordError = {userState.passwordError} 
                                onChange={onChange} />
                            </div>
                        </div>
                    </div>
                    <div className="other-info-container">
                        <div className="other-info">
                            <h3>Other Information</h3>
                            <Input label="First Name" name="first_name" value={first_name} error={error} onChange={onChange} />
                            <Input label="Last Name" name="last_name" value={last_name} error={error} onChange={onChange} />
                            <Input label="Designation" name="designation" value={designation} onChange={onChange} />
                            <SelectInput label="Role" name="role" value={role} values={selectRoleValues} onChange={onChange} />
                            <SelectInput label="Status" name="status" value={status} values={selectStatusValues} onChange={onChange} />
                        </div>
                    </div>
                </div>

                <div className="user-button">
                    <button onClick = {() => addUpdateUser(file, filename, userID, user)}>
                        Post
                    </button>
                </div>
            </div>
        </div>
    );

}


































/*
return (
    <div className="user-modal" style = {{display: showModal ? "block" : "none"}}>
        <button id = "close-modal" onClick = {closeModal}>X</button>
        <div className="user-modal-content">
            <div className="user-info-wrapper">
                <div className="user-image">
                    <ImageUploader isUploading = {isUploading} imgUrl = {imgUrl} file = {file} filename = {filename} fileHandler = {fileHandler} />
                </div>
                <div className="user-info">
                    <div className="other-info-container">
                        <div className="other-info">
                            <h3>Other Information</h3>
                            <Input label="First Name" name="first_name" value={first_name} error={error} onChange={onChange} />
                            <Input label="Last Name" name="last_name" value={last_name} error={error} onChange={onChange} />
                            <Input label="Designation" name="designation" value={designation} onChange={onChange} />
                            <SelectInput label="Role" name="role" value={role} values={selectRoleValues} onChange={onChange} />
                            <SelectInput label="Status" name="status" value={status} values={selectStatusValues} onChange={onChange} />   
                        </div>
                    </div>
                    <div className="basic-info-container">
                        <div className="basic-info">
                            <h3>Basic Information</h3>
                            <Input label="Username" name="username" value={username} error={error} onChange={onChange} />
                            <PasswordInput label="Password" name="password" value={password} error={error} onChange={onChange} />
                            <PasswordInput label="Confirmation Password" name="password2" value={password2} error={error} onChange={onChange} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="user-button">
                <button value = {typeof editUsername !== "undefined" ? editUsername : ""} onClick = {addUser}>
                    Add New User
                </button>
            </div>
        </div>
    </div>
);
*/


