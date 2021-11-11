import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
// Auth
import { isAuthenticated } from "../Auth/Auth";

import { CommonContext } from "../../contexts/common_contexts/CommonContext";


import "./Dashboard.css";

export const Dashboard = () => {

    const { setShowSideNav } = useContext(CommonContext);
    const history = useHistory();


    // main and side nav was hid on login component, but here needs to be displayed
    useEffect(() => {
        setShowSideNav(false);
        document.querySelector(".main-nav").style.display = "block";
        document.querySelector(".side-nav").style.display = "block";
    }, []);





    

    // if user in not authenticated redirect to home/login page
    if(!isAuthenticated()) {
        return <div>{history.push("/")}</div>
    }


    return (
        <div className="content dashboard" onClick = {() => setShowSideNav(false)}>
           <h1>Dashboard</h1>
           {/* <div className="dashboard-image">
                <img src="../../profile.jpg" />
           </div> */}
           
        </div>
    );
   
}