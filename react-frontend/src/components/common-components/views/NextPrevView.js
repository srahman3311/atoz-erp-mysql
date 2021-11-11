import React from "react";




export const NextPrevView = ({ totalListLength, limit, offset, showNextPrevItems, searchText}) => {
    
    return (

        <div className="items-view">
            <div className="data-content">
                <p>Showing { 
                totalListLength === 0 ? 0 : totalListLength === offset ? (limit + 1 > totalListLength ? 1 : offset - limit + 1) : offset + 1
                } to { 
                limit + offset > totalListLength ? totalListLength : limit + offset 
                } of {totalListLength} results 
                </p>
            </div>
            <div className="next-prev">
                <button 
                    name="prev" 
                    onClick={event => showNextPrevItems(event.target.value, searchText)} 
                    value={offset - limit < 0 ? 0 : (offset === totalListLength && offset - limit * 2 >= 0 ? offset - limit * 2 : offset - limit)}>
                       &laquo; Prev
                </button>
                <button 
                    name="next" 
                    onClick={event => showNextPrevItems(event.target.value, searchText)} 
                    value={offset + limit > totalListLength ? offset : offset + limit }>
                        Next &raquo;
                </button>
            </div>
        </div>
    )
}





// value={offset - limit < 0 ? 0 : offset - limit}>






























/*
export const NextPrevView = (props) => {
    return (

        <div className="items-view">
            <div className="data-content">
                <p>Showing { 
                props.totalListLength === 0 ? 0 : props.offset + 1 
                } to { 
                props.limit + props.offset > props.totalListLength ? props.totalListLength : props.limit + props.offset 
                } of {props.totalListLength} results 
                </p>
            </div>
            <div className="next-prev">
                <button 
                    name="prev" 
                    onClick={props.showNextPrevItems} 
                    value={props.offset - props.limit < 0 ? 0 : props.offset - props.limit}>
                       Prev
                </button>
                <button 
                    name="next" 
                    onClick={props.showNextPrevItems} 
                    value={props.offset + props.limit > props.totalListLength ? props.offset : props.offset + props.limit }>
                        Next
                </button>
            </div>
        </div>
    )
}
*/



