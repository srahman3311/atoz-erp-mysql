import React from "react";
import { CSVLink } from "react-csv";

export const Export = ({ data, exportToPdf }) => {
    return (
        <div className="exports">
            <button className = "export-button" onClick = {exportToPdf}>export-to-pdf</button>
            <button className = "export-button"><CSVLink data={data}>export-to-csv</CSVLink></button>
        </div>
    )
}
