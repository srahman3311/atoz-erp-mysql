import { 
    FETCH_DATA, 
    ADD_UPDATE_ITEM, 
    CHANGE_VIEW_LIMIT, 
    SEARCH_ITEMS, 
    NEXT_PREV_ITEMS, 
    TOGGLE_ACTION_LIST, 
    TOGGLE_DELETE_MODAL,
    FORM_VALIDATION_ERROR  
} from "../types/types";


export const expenseReducer = (state, action) => {
    switch(action.type) {
        
        case FETCH_DATA:
            // Three times data will be fetched. Each time offset, limit, searchTextValue & totalListLength must be set to 
            // dynamic values.
            // 1. On component mounts and remounts - everything will be started from the beginning. 
            // 2. On closing modal after adding or updating an item - offset/limit/searachTextValue will have prev values. 
            // totalListLength will be updated if a new item has been added.
            // 3. On deleting an item - offset/limit/searachTextValue will have prev values. totalListLength will be updated.
            return {
                ...state,
                expenses: action.payload.expenses,
                limit: action.payload.limit,
                offset: action.payload.offset,
                totalListLength: action.payload.totalListLength,
                searchTextValue: action.payload.searchText,
                // if data are fetched after deleting an item
                displayExpenseDeleteModal: false, 
                // to hide the action list
                actionListId: 0, 
                // data will be fetched after every modal close so formValidationError should be set to false and successFailMessage
                // to null so modal doesn't show previously set error and success fail messages
                formValidationError: false, 
                successFailMessage: null
            };
        
        case ADD_UPDATE_ITEM:
            return {
                ...state,
                successFailMessage: state.successFailMessage !== null ? null : action.payload
            }

        case SEARCH_ITEMS: 
            // When user attempts to search database, fresh start should happen. And for this, previous offset value should be set to 0
            return {
                ...state,
                expenses: action.payload.expenses,
                totalListLength: action.payload.totalListLength,
                searchTextValue: action.payload.searchText,
                offset: 0
            };

        case NEXT_PREV_ITEMS:
            // When user attempts to navigate to and from next/previous items and there is a searchTextValue already there, 
            // it should stay as it is
            return {
                ...state,
                expenses: action.payload.expenses,
                totalListLength: action.payload.totalListLength,
                searchTextValue: action.payload.searchText,
                // offset must be set with dynamic value from frontend
                offset: action.payload.offsetValue 
            };

        case CHANGE_VIEW_LIMIT:
            return {
                ...state,
                expenses: action.payload.expenses,
                totalListLength: action.payload.totalListLength,
                // limit must be updated with dynamic value
                limit: action.payload.limit,
                // offset must be set to 0
                offset: 0
            }
        
        case FORM_VALIDATION_ERROR:
            return {
                ...state,
                formValidationError: action.payload,
                successFailMessage: null
            }
        
        case TOGGLE_DELETE_MODAL: 
            return {
                ...state,
                expenseID: action.expenseID,
                displayExpenseDeleteModal: state.displayExpenseDeleteModal ? false : true, 
                actionListId: 0
            }
        
        case TOGGLE_ACTION_LIST:
            return {
                ...state,
                actionListId: !state.actionListId ? action.payload : 0
            }
        

        default: 
            return state;
    }
}