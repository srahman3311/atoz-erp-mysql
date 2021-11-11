import React from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";

// Context Providers
import { JobContextProvider } from "./contexts/job_contex/JobContext";
import { MaterialContextProvider } from "./contexts/material_context/MaterialContext";
import { SubheadContextProvider } from "./contexts/subhead_context/SubheadContext";
import { PayorderContextProvider } from "./contexts/payorder_context/PayorderContext";
import { ExpenseContextProvider } from "./contexts/expense_context/ExpenseContext";
import { CreditContextProvider } from "./contexts/credit_context/CreditContext";
import { UserContextProvider } from "./contexts/user_context/UserContext";
import { CommonContextProvider } from "./contexts/common_contexts/CommonContext";
import { JobReportContextProvider } from "./contexts/job_report_context/JobReportContext";

// Components
import { MainNav } from "./components/Navigation/MainNav";
import { SideNav } from "./components/Navigation/SideNav";
import { Login } from "./components/Login/Login";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { UserList } from "./components/Users/UserList";
import { PayorderList } from "./components/Payorders/PayorderList";
import { JobList } from "./components/Jobs/JobList";
import { MaterialList } from "./components/Materials/MaterialList";
import { SubheadList } from "./components/Subheads/SubheadList";
import { ExpenseList } from "./components/Expenses/ExpenseList";
import { CreditList } from "./components/Credits/CreditList";
import { Profile } from "./components/Profile/Profile";
import { ExpenseReport } from "./components/ExpenseReport/ExpenseReport";
import { ReportList } from "./components/ExpenseReport/ReportList";
// Stylesheet
import "./App.css"


function App() {
 
  return (
    <CommonContextProvider>
      <UserContextProvider>
        <JobContextProvider>
          <MaterialContextProvider>
            <SubheadContextProvider>
              <CreditContextProvider>
                <ExpenseContextProvider>
                  <PayorderContextProvider>
                    <JobReportContextProvider>
                      <div className = "container">
                        <Router>
                          <MainNav />
                          <SideNav />
                          <Route exact path = "/"  component = {Login} />
                          <Route exact path = "/dashboard"  component = {Dashboard} />
                          <Route exact path = "/dashboard/jobs"  component = {JobList} />
                          <Route exact path = "/dashboard/materials"  component = {MaterialList} />
                          <Route exact path = "/dashboard/subheads"  component = {SubheadList} />
                          <Route exact path = "/dashboard/credits"  component = {CreditList} />
                          <Route exact path = "/dashboard/expenses"  component = {ExpenseList} />
                          <Route exact path = "/dashboard/users"  component = {UserList} />
                          <Route exact path = "/dashboard/payorders"  component = {PayorderList} />
                          <Route exact path = "/profile/:slug" component={Profile} />
                          <Route exact path = "/dashboard/reports/expense"  component = {ExpenseReport} />
                          <Route exact path = "/dashboard/reports/expense/list"  component = {ReportList} />
                        </Router>
                      </div>
                    </JobReportContextProvider>
                  </PayorderContextProvider>
                </ExpenseContextProvider>
              </CreditContextProvider>
            </SubheadContextProvider>
          </MaterialContextProvider>
        </JobContextProvider>
      </UserContextProvider>
    </CommonContextProvider>
  );
  
}

export default App;

