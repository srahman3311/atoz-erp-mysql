import React, { useState } from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";

// Components
import Home from "./components/Home/Home";
import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./components/Profile/Profile";
import Users from "./components/UserList/Users";
import {JobList} from "./components/JobList/JobList";
import Expenses from "./components/Expenses/Expenses";
import Materials from "./components/Materials/Materials";
import Subheads from "./components/Subheads/Subheads";
import Payorders from "./components/Payorders/Payorders";


// Stylesheet
import "./App.css"


function App() {
 
  return (
    <Router>
      <Route exact path = "/"  component = {Home} />
      <Route exact path = "/dashboard" component = {Dashboard}/>
      <Route exact path = "/dashboard/jobs"  component = {JobList} />
      <Route exact path = "/dashboard/expenses"  component = {Expenses} />
      <Route exact path = "/dashboard/subheads"  component = {Subheads} />
      <Route exact path = "/dashboard/materials"  component = {Materials} />
      <Route exact path = "/dashboard/payorders"  component = {Payorders} />
      <Route exact path = "/profile/:slug" component={Profile} />
      <Route exact path = "/users"  component={Users} />
    </Router>
  );
  
}

export default App;
