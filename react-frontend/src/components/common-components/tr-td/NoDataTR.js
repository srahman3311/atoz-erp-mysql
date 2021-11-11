import React from "react";

export const NoDataTR = ({ colSpan }) => {
    return (
        <tr>
            <td className="no-data-td" colSpan = {colSpan} style = {{fontSize: "25px"}}>
                No data to show
            </td>
        </tr>
    )
}
