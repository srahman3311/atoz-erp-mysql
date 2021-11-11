import React from "react"

export const ProfileImage = ({ user }) => {
    return (
        <div className="profile-picture">
            <h2>Profile Picture</h2>
            <img src = {user.imgUrl} alt = {user.username} />
        </div>
    )
}
