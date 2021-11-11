import React, { useContext } from "react";

// Children
import { UserTextInput } from "../../inputs/UserTextInput";
import { UserSelectInput } from "../../inputs/UserSelectInput";
// Contexts
import { UserContext } from "../../../../contexts/user_context/UserContext";

export const GeneralInfo = ({ onChange, userInfo, roles, statuses }) => {

    const role = localStorage.getItem("role");

    // User Contexts
    const { userState } = useContext(UserContext);

    return (
        <div className="general-info">

            <UserTextInput
            dynamic_class = "user-text-input" 
            label = "First Name" 
            name = "first_name" 
            value = {userInfo.first_name} 
            onChange = {onChange}
            error = {userState.formValidationError} 
            />

            <UserTextInput
            dynamic_class = "user-text-input" 
            label = "Last Name" 
            name = "last_name" 
            value = {userInfo.last_name} 
            onChange = {onChange}
            error = {userState.formValidationError} 
            />

            <UserTextInput
            dynamic_class = "user-text-input"  
            label = "Designation" 
            name = "designation" 
            value = {userInfo.designation} 
            onChange = {onChange}
            error = {userState.formValidationError}
            role = {role} 
            />

            <UserSelectInput
            dynamic_class = "user-select-input" 
            label="Role" 
            name="role" 
            value={userInfo.role} 
            values={roles} 
            onChange={onChange}
            role = {role} 
            />
            <UserSelectInput
            dynamic_class = "user-select-input" 
            label="Status" 
            name="status" 
            value={userInfo.status} 
            values={statuses} 
            onChange={onChange} 
            role = {role}
            />

        </div>
    );
}