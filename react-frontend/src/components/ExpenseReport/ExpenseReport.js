import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import DatePicker from "react-datepicker";
import { useHistory } from "react-router-dom";

// Auth Middleware
import { isAuthenticated } from "../Auth/Auth";

// Children
import { Input } from "./Input";

// Contexts
import { CommonContext } from "../../contexts/common_contexts/CommonContext";

// Stylesheet
import "./Reports.css";



export const ExpenseReport = () => {

    const history = useHistory();
    const cookies = new Cookies();
    const jwtToken = cookies.get("jwtToken");

    // Common Contexts
    const { setShowSideNav } = useContext(CommonContext);

    // Dates
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [searchText, setSearchText] = useState("");
    // Jobs
    const [job, setJob] = useState("All Jobs");
    const [jobs, setJobs] = useState([]);
    // Materials
    const [material, setMaterial] = useState("All Materials");
    const [materials, setMaterials] = useState([]);
    // Subheads
    const [subhead, setSubhead] = useState("All Subheads");
    const [subheads, setSubheads] = useState([]);
    // Users
    const [user, setUser] = useState("All Users");
    const [users, setUsers] = useState([]);
    // Status
    const [status, setStatus] = useState("All Statuses");
    const statuses = [
        {_id: 1, value: "Approved"},
        {_id: 2, value: "Pending"},
        {_id: 3, value: "Rejected"}
    ];

    const [jobListVisible, setJobListVisible] = useState(false);
    const [subheadListVisible, setSubheadListVisible] = useState(false);
    const [materialListVisible, setMaterialListVisible] = useState(false);
    const [userListVisible, setUserListVisible] = useState(false);
    const [statusListVisible, setStatusListVisible] = useState(false);

    useEffect(() => {

        const endPoint = "http://localhost:3030/api/jobs";
        const headers = { "x-auth-token": jwtToken };
        
        axios.get(endPoint, { headers })
            .then(jobRes => {
                setJobs(jobRes.data);

                axios.get("http://localhost:3030/api/materials", { headers })
                    .then(materialRes => {
                        setMaterials(materialRes.data);

                        axios.get("http://localhost:3030/api/subheads", { headers })
                            .then(subheadRes => {
                                setSubheads(subheadRes.data);

                                axios.get("http://localhost:3030/api/users", { headers })
                                    .then(userRes => {
                                        setUsers(userRes.data);
                                    })
                                    .catch(err => console.log(err));
                            })
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));
               
            })
            .catch(err => console.log(err));

    }, []);

    const onChange = ev => {

        const name = ev.target.name;
        const value = ev.target.value;
        setSearchText(value);
        let endPoint;

        if(name === "job") endPoint = "http://localhost:3030/api/jobs/search";
        if(name === "material") endPoint = "http://localhost:3030/api/materials/search";
        if(name === "subhead") endPoint = "http://localhost:3030/api/subheads/search";
        if(name === "user") endPoint = "http://localhost:3030/api/users/search";

        const options = { searchText: value };
        const headers = { "x-auth-token": jwtToken };
        axios.post(endPoint, options, { headers })
            .then(res => {
                if(name === "job") setJobs(res.data);
                if(name === "material") setMaterials(res.data);
                if(name === "subhead") setSubheads(res.data);
                if(name === "user") setUsers(res.data);
            })
            .catch(err => console.log(err));
    }

    const selectItem = ev => {

        const name = ev.target.className;
        const textContent = ev.target.textContent;

        if(name === "job") {
            setJobListVisible(false);
            setJob(textContent);
            return;
        }

        if(name === "material") {
            setMaterialListVisible(false);
            setMaterial(textContent);
            return;
        }

        if(name === "subhead") {
            setSubheadListVisible(false);
            setSubhead(textContent);
            return;
        }

        if(name === "user") {
            setUserListVisible(false);
            setUser(textContent);
            return;
        }

        if(name === "status") {
            setStatusListVisible(false);
            setStatus(textContent);
            return;
        }
        
    }


    const showReport = e => {

        const item = e.target.textContent;
        const queryParams = `job=${job}&material=${material}&subhead=${subhead}&user=${user}&status=${status}`;
        const queryDatesAndItem = `&item=${item}&startDate=${startDate}&endDate=${endDate}`;

        window.open(`/dashboard/reports/expense/list?${queryParams}${queryDatesAndItem}`, "_blank");

    }


    // if user in not authenticated redirect to home/login page
    if(!isAuthenticated()) {
        return <div>{history.push("/")}</div>
    }

    return (
        <div className="content expense-report" onClick = {() => setShowSideNav(false)}>
            <div className="report-dates">
                <div className="report-dates-header">
                    <h3>Select Dates</h3>
                </div>
                <h5>From</h5>
                <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
                <h5>To</h5>
                <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
            </div>

            <div className="report-category">

                <div className="report-category-header">
                    <h3>Category Options</h3>
                </div>
                <div className="report-category-content">
                    <div className="list-dropdown job-dropdown" >
                        <span onClick = {() => jobListVisible ? setJobListVisible(false) : setJobListVisible(true)}>
                            {job}
                            <i className="fas fa-chevron-down"></i>
                        </span>
                        <div className="job-dropdown-list item-dropdown-list" style={{display: jobListVisible ? "block" : "none"}}>
                            <Input name="job" onChange={onChange} searchText={searchText} />
                            <ul>
                                <li className="job" onClick = {selectItem}>All Jobs</li>
                                {jobs.map(job => {
                                    return (
                                        <li className = "job" key = {job.serial_no} onClick = {selectItem}>
                                            {job.name}({job.description})
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>


                    <div className="list-dropdown material-dropdown" >
                        <span onClick = {() => materialListVisible ? setMaterialListVisible(false) : setMaterialListVisible(true)}>
                            {material}
                            <i className="fas fa-chevron-down"></i>
                        </span>
                        <div className="material-dropdown-list item-dropdown-list" style={{display: materialListVisible ? "block" : "none"}}>
                            <Input name="material" onChange={onChange} searchText={searchText} />
                            <ul>
                                <li className="material" onClick = {selectItem}>All Materials</li>
                                {materials.map(material => {
                                    return (
                                        <li className = "material" key = {material.serial_no} onClick = {selectItem}>
                                            {material.name}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>


                    <div className="list-dropdown subhead-dropdown" >
                        <span onClick = {() => subheadListVisible ? setSubheadListVisible(false) : setSubheadListVisible(true)}>
                            {subhead}
                            <i className="fas fa-chevron-down"></i>
                        </span>
                        <div className="subhead-dropdown-list item-dropdown-list" style={{display: subheadListVisible ? "block" : "none"}}>
                            <Input name="subhead" onChange={onChange} searchText={searchText} />
                            <ul>
                                <li className="subhead" onClick = {selectItem}>All Subheads</li>
                                {subheads.map(subhead => {
                                    return (
                                        <li className = "subhead" key = {subhead.serial_no} onClick = {selectItem}>
                                            {subhead.name}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    <div className="list-dropdown user-dropdown" >
                        <span onClick = {() => userListVisible ? setUserListVisible(false) : setUserListVisible(true)}>
                            {user}
                            <i className="fas fa-chevron-down"></i>
                        </span>
                        <div className="user-dropdown-list item-dropdown-list" style={{display: userListVisible ? "block" : "none"}}>
                            <Input name="user" onChange={onChange} searchText={searchText} />
                            <ul>
                                <li className="user" onClick = {selectItem}>All Users</li>
                                {users.map(user => {
                                    return (
                                        <li className = "user" key = {user.user_id} onClick = {selectItem}>
                                            {user.username}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className="list-dropdown user-dropdown" >
                        <span onClick = {() => statusListVisible ? setStatusListVisible(false) : setStatusListVisible(true)}>
                            {status}
                            <i className="fas fa-chevron-down"></i>
                        </span>
                        <div className="status-dropdown-list item-dropdown-list" style={{display: statusListVisible ? "block" : "none"}}>
                            <ul>
                                <li className="status" onClick = {selectItem}>All Statuses</li>
                                {statuses.map(item => {
                                    return (
                                        <li className = "status" key = {item._id} onClick = {selectItem}>
                                            {item.value}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                    
                </div>
            </div>
            <div className="report-item">
                <div className="report-item-header">
                    <h3>Select Report Item</h3>
                </div>
                <div className="report-item-content">
                    <button onClick={showReport}>Debit</button>
                    <button onClick={showReport}>Credit</button>
                    <button onClick={showReport}>Balance</button>
                </div>
            </div> 
        </div>
    );
}

