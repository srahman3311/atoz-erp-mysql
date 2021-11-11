import React, { createContext, useReducer } from "react";
import { jobReportReducer } from "./jobReportReducer";



export const JobReportContext = createContext();


export const JobReportContextProvider = ({ children }) => {

    const [jobReportState, dispatch] = useReducer(jobReportReducer, {
        results: [],
        startDate: null,
        endDate: null,
        item: ""
    });

    return (
        <JobReportContext.Provider value = {{ jobReportState, dispatch }}>
            { children }
        </JobReportContext.Provider>
    );
}