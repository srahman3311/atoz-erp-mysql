import Cookies from "universal-cookie";

export const isAuthenticated = () => {
    const cookies = new Cookies();
    const jwtToken = cookies.get("jwtToken");

    if(typeof jwtToken === "undefined") return false;

    return true;
    
}