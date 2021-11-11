import React, { useState, createContext} from "react";

export const CommonContext = createContext();



export const CommonContextProvider = ({ children }) => {
    const [showSideNav, setShowSideNav] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    return (
        <CommonContext.Provider value = {{showSideNav, setShowSideNav, showProfileMenu, setShowProfileMenu}}>
            { children }
        </CommonContext.Provider>
    );
}