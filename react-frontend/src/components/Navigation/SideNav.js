import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";



import { CommonContext } from "../../contexts/common_contexts/CommonContext";

// Stylesheet
import "./Navigation.css";

export const SideNav = () => {

    const [isReportRoutesDisplayed, setIsReportRoutesDisplayed] = useState(false);

    const { showSideNav, setShowSideNav } = useContext(CommonContext);

    return (
        <div className="side-nav" style = {{transform: showSideNav ? "translateX(0%)" : "translateX(-150%)"}}>
            <button id="sidenav-close" onClick = {() => setShowSideNav(false)}>&#10005;</button>
            <Link to="/dashboard">Dashboard</Link>
            <Link to = "/dashboard/jobs">Jobs</Link>
            <Link to = "/dashboard/subheads">Subheads</Link>
            <Link to = "/dashboard/materials">Materials</Link>
            <Link to = "/dashboard/credits">Credits</Link>
            <Link to = "/dashboard/expenses">Expenses</Link>
            <Link to="/dashboard/payorders">Payorders</Link>
            <Link to = "/dashboard/users">Users</Link>
            <button id="report-routes-displayer" 
            onClick = {() => isReportRoutesDisplayed ? setIsReportRoutesDisplayed(false) : setIsReportRoutesDisplayed(true)}>
                Reports
            </button>
            <div id="report-routes" style={{display: isReportRoutesDisplayed ? "block" : "none"}}>
                <Link to="/dashboard/reports/payorders">Payorder Report</Link>
                <Link to="/dashboard/reports/expense">Expense/Job Report</Link>
            </div>
            
           
        </div>
    );
}

{/* <div id="report-routes-container">
<button id="xxx" onClick = {() => isReportRoutesDisplayed ? setIsReportRoutesDisplayed(false) : setIsReportRoutesDisplayed(true)}>
    Reports
</button>

</div> */}
