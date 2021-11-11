import React from "react";

// Children
import { UserDataTR } from "./UserDataTR";






export const UserDetails = ({ user }) => {
    return (
        <div className="user-details">
            <h2>User Details</h2>
            <table id = "user-info-table">
                <tbody>
                    <UserDataTR title = "User ID" content={user.user_id} />
                    <UserDataTR title = "Username" content={user.username} />
                    <UserDataTR title = "First Name" content={user.first_name} />
                    <UserDataTR title = "Last Name" content={user.last_name} />
                    <UserDataTR title = "Designation" content={user.designation} />
                    <UserDataTR title = "User Role" content={user.role} />
                    <UserDataTR title = "Activity Status" content={user.status} />
                </tbody>
            </table>
        </div>
    )
}
