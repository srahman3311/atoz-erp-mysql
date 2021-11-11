import React, { useContext } from "react";
import { Link } from "react-router-dom";

// Children
import { NoDataTR } from "../common-components/tr-td/NoDataTR";

// Context
import { UserContext } from "../../contexts/user_context/UserContext";


export const UserListBody = ({ toggleActionList, displayModal, toggleDeleteModal, actionListId }) => {

    // Using context
    const { userState } = useContext(UserContext);

    

    return (
        <tbody>
        {
            !userState.users.length 
            ?
            <NoDataTR colSpan = "9"/>
            :
            userState.users.map(user => {
                return (
                    <tr key = {user.user_id}>
                        <td>{user.user_id}</td>
                        <td>{user.first_name}</td>
                        <td>{user.last_name}</td>
                        <td>{user.username}</td>
                        <td>{user.designation}</td>
                        <td>{user.role}</td>
                        <td>{user.status}</td>
                        <td><Link to ={`/profile/${user.username}`}>Profile</Link></td>
                        <td className="action-list-td">
                            <button value={user.user_id} onClick={ev => toggleActionList(ev.target.value)} className="action-button">
                                action
                            </button>
                            <div className="action-list" style={{display: actionListId === user.user_id ? "block" : "none"}}>
                                <button className="action-list-buttons" value = {user.user_id} onClick = {displayModal}>
                                    Update
                                </button>
                                <button 
                                className="action-list-buttons" 
                                value={user.user_id} 
                                onClick={ev => toggleDeleteModal(ev.target.value)}>
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>          
                );
            })
        }
        </tbody>
    );
}
