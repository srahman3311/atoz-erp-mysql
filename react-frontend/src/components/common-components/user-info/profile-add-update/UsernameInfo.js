import React, { useContext } from "react";

// Children
import { UserTextInput } from "../../inputs/UserTextInput";
// Contexts
import { UserContext } from "../../../../contexts/user_context/UserContext";


export const UsernameInfo = ({ onChange, userInfo }) => {

    // User Contexts
    const { userState } = useContext(UserContext);

    return (
        <div className="username-info">
            <UserTextInput
            dynamic_class = "user-text-input" 
            label = "Username" 
            name = "username" 
            value = {userInfo.username} 
            onChange = {onChange}
            error = {userState.formValidationError} 
            />
        </div>
    );
}