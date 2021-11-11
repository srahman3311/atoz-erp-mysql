import React from "react";

export const LoginHeader = ({ errorMsg }) => {

    return (
        <div className="login-header">
            <h1>Please Login To View</h1>
            <p style = {{color: "#cc7351", letterSpacing: "2px", display: errorMsg ? "block" : "none"}}>{errorMsg}</p>
        </div>
    )
}
