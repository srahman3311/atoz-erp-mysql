import React, { useContext } from "react";

// Children
import { UserPasswordInput } from "../../inputs/UserPasswordInput";
// Contexts
import { UserContext } from "../../../../contexts/user_context/UserContext";


export const PasswordInfo = ({ onChange, userInfo, userID }) => {

    // User Contexts
    const { userState, dispatch } = useContext(UserContext);

    return (
        <div className="password-info">

            <div className="password-message" style ={{display: userID ? "block" : "none"}}>
                <p>&#9734; Leave the password fields empty if update is not needed</p>
            </div>
            <div className="password-error-message" style = {{display: userState.passwordError ? "block" : "none"}}>
                <p>{userState.passwordError}</p>
            </div>
            <UserPasswordInput
            dynamic_class = "user-password-input" 
            label = "Password"
            name="password" 
            value={userInfo.password} 
            onChange={onChange}
            error = {userState.formValidationError} 
            />

            <UserPasswordInput
            dynamic_class = "user-password-input" 
            label = "Confirm Password"
            name="password2" 
            value={userInfo.password2} 
            onChange={onChange} 
            error = {userState.formValidationError} 
            />

            <div className="success-fail-message" style ={{display: userState.successFailMessage !== null ? "flex": "none"}}>
                <p>{ userState.successFailMessage }</p>
                <button id="message-close" onClick = {() => dispatch({type: "ADD_UPDATE_ITEM"})}>X</button>
            </div>
        </div>
    );
}