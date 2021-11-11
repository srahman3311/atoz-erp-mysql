import { FETCH_DATA } from "../types/types";


export const jobReportReducer = (state, action) => {

    console.log(action.payload);
    switch(action.type) {
        case FETCH_DATA: 
            return {
                ...state,
                results: action.payload.results,
                item: action.payload.item,
                startDate: action.payload.startDate,
                endDate: action.payload.endDate
            }
        
        default: 
            return state;
    }
}