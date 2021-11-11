import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { useHistory } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Auth Middleware
import { isAuthenticated } from "../Auth/Auth";

// Children
import { ViewLimitSearch } from "../common-components/views/ViewLimitSearch";
import { NextPrevView } from "../common-components/views/NextPrevView";
import { Export } from "../common-components/export-buttons/Export";
import { ModalButton } from "../common-components/others/ModalButton";
import { ListTitle } from "../common-components/list-title/ListTitle";
import { MaterialListHeader } from "./MaterialListHeader";
import { MaterialListBody } from "./MaterialListBody";
import { MaterialModal } from "./MaterialModal";
import { DeleteModal } from "../common-components/delete-prompt-modal/DeleteModal";


// Contexts
import { MaterialContext } from "../../contexts/material_context/MaterialContext";
import { CommonContext } from "../../contexts/common_contexts/CommonContext";


export const MaterialList = () => {

    const history = useHistory();

    // Json web token is needed to be sent to backend for checking if api calls through axios are authorized or not
    const cookies = new Cookies();
    const jwtToken = cookies.get("jwtToken");
    // Material Contexts
    const { 
        materialState, 
        dispatch, 
        addUpdateMaterial, 
        changeViewLimit, 
        searchMaterials, 
        showNextPrevMaterials, 
        toggleDeleteModal, 
        toggleActionList, 
        deleteMaterial 
    } = useContext(MaterialContext);
    // Common Contexts
    const { setShowSideNav } = useContext(CommonContext);

    // States
    // Need to send unique material id to backend for updating record
    const [materialID, setMaterialID] = useState(0);
    // For toggling modal
    const [isModalDisplayed, setIsModalDisplayed] = useState(false);
    const [material, setMaterial] = useState({
        name: "",
        unit: "",
        status: ""
    });
    // function for fetching data at component mount and hideModal
    const fetchData = (limit, offset, searchText) => {
        const endPoint = "http://localhost:3030/api/materials";
        // Search text is for re-using endPoint  
        const options = { limit, offset, searchText };
        const headers = { "x-auth-token": jwtToken };
        axios.post(endPoint, options, { headers })
            .then(res => {
                dispatch({
                    type: "FETCH_DATA",
                    payload: {
                        materials: res.data.materials,
                        totalListLength: res.data.results.length, 
                        limit,
                        offset,
                        searchText
                    }
                });
            })
            .catch(err => console.log(err));
    }
    // For fetching data at the component mount
    useEffect(() => {
        // hide side-nav at component mount
        setShowSideNav(false);
        // when component mounts or remounts after navigating away start everything from the beginning
        fetchData(15, 0, "");
    }, []);

    // Input onChange event handler function
    function onChange(e) {

        const name = e.target.name;
        const value = e.target.value;
        
        setMaterial(prev => {
            return {...prev, [name]: value}
        });
    }

    const displayModal = e => {
        // hide the action list after user clicks on update button
        dispatch({type: "TOGGLE_ACTION_LIST", payload: 0})
        setIsModalDisplayed(true);
        // for updating a specific Material
        if(e.target.value !== "") {
            materialState.materials.map(item => {
                if(item.serial_no === Number(e.target.value)) {
                    // need to send unique job name to backend for updating
                    setMaterialID(item.serial_no);
                    setMaterial(previousValue => {
                        return {
                            ...previousValue,
                            name: item.name,
                            unit: item.unit,
                            status: item.status
                        }
                    });
                }           
            });
        }
    }

    const hideModal = () => {
        setIsModalDisplayed(false);
        // // to setting the form validation error to false, so that modal doesn't show previous validation error messages
        // dispatch({type: "FORM_VALIDATION_ERROR", payload: false});
        // set jobName to null if modal was displayed for updating
        setMaterialID(0);
        // return the job to it's initial state
        setMaterial(previousValue => {
            return {
                ...previousValue,
                name: "",
                unit: "",
                status: ""
            }
        });
        // to update the list with newly added item or updated item
        fetchData(materialState.limit, materialState.offset, materialState.searchTextValue);
    }

    function exportToPdf() {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "Material Report";
        const headers = [["Serial No", "Material Name", "Unit", "Status"]];

        const data = materialState.materials.map(item => [
            item.serial_no,
            item.name,
            item.unit,
            item.status
        ]);

        let content = {
            startY: 50,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("materialReport.pdf")
    }


   // if user in not authenticated redirect to home/login page
    if(!isAuthenticated()) {
        return <div>{history.push("/")}</div>
    }
    
    return (
        <div className="content material-list" onClick = {() => setShowSideNav(false)}>
            <ListTitle title = "Material List" />
            <div className = "content-search-export">
                <ViewLimitSearch 
                searchItems = {searchMaterials} 
                searchText = {materialState.searchTextValue} 
                changeViewLimit = {changeViewLimit} 
                />
                <Export exportToPdf = {exportToPdf} data = {materialState.materials}/>
                <ModalButton textContent = "Add New Material" displayModal = {displayModal} />
            </div>
            <div className="list">
                <table>
                    <MaterialListHeader />
                    <MaterialListBody 
                    toggleActionList = {toggleActionList}
                    displayModal = {displayModal}
                    toggleDeleteModal = {toggleDeleteModal}
                    actionListId = {materialState.actionListId}
                    />
                </table>
            </div>
            <NextPrevView
            totalListLength = {materialState.totalListLength} 
            limit = {materialState.limit}
            offset = {materialState.offset}
            showNextPrevItems = {showNextPrevMaterials}
            searchText = {materialState.searchTextValue}
            />
            <MaterialModal 
            isModalDisplayed = {isModalDisplayed} 
            material = {material}
            error = {materialState.formValidationError} 
            onChange = {onChange}
            addUpdateMaterial = {addUpdateMaterial}
            materialID = {materialID}
            successFailMessage = {materialState.successFailMessage}
            dispatch = {dispatch}
            hideModal = {hideModal}
            />
            <DeleteModal 
            displayDeleteModal = {materialState.displayMaterialDeleteModal}
            toggleDeleteModal = {toggleDeleteModal} 
            itemName = {materialState.materialID}
            deleteItem = {deleteMaterial}
            offset = {materialState.offset}
            limit = {materialState.limit}
            searchText = {materialState.searchTextValue}
            />
        </div>
    )
}

