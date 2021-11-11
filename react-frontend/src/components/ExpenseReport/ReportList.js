import React, { useState, useEffect } from "react";
import queryString from "query-string";
import axios from "axios";
import Cookies from "universal-cookie";

// Children
import { ReportListBody } from "./ReportListBody";
import { ReportListHeader } from "./ReportListHeader";

// location object is part of the URL, it is used to retrieve the query parameters sent from previous navigation URL
export const ReportList = ({ location }) => {

    const cookies = new Cookies();
    const jwtToken = cookies.get("jwtToken");

    // State
    const [newStartDate, setNewStartDate] = useState("");
    const [newEndDate, setNewEndDate] = useState("");
    const [newItem, setNewItem] = useState("");
    const [results, setResults] = useState([]);
   
    useEffect(() => {
        // location.search will find all the query string parameters that have been sent from previous navigation URL
        // queryString.parse method will parse the location.search which can be destructured in the following way
        const { job, material, subhead, user, status, startDate, endDate, item } = queryString.parse(location.search);

        const startDay = new Date(startDate).getDate();
        const startMonth = new Date(startDate).getMonth() + 1;
        const startYear = new Date(startDate).getFullYear();
        
        const endDay = new Date(endDate).getDate();
        const endMonth = new Date(endDate).getMonth() + 1;
        const endYear = new Date(endDate).getFullYear();

        setNewStartDate(`${startDay}/${startMonth}/${startYear}`);
        setNewEndDate(`${endDay}/${endMonth}/${endYear}`);
        setNewItem(item);


        const endPoint = "http://localhost:3030/api/reports/jobs-expenses";
        const options = { job, material, startDate: new Date(startDate), endDate: new Date(endDate), subhead, user, status };
        const headers = {"x-auth-token": jwtToken};

        axios.post(endPoint, options, { headers })
            .then(res => {
                setResults(res.data.results);
            })
            .catch(err => console.log(err))
    }, [])


    return (
        <div className="job-report-list">
            <h2>A To Z Trading</h2>
            <h3> {newItem} Report From {newStartDate} To {newEndDate}</h3>
            <table>
                <ReportListHeader />
                <ReportListBody results = {results} />
            </table>
        </div>
       
    )
}
