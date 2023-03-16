import { useState } from 'react';

const userState = () => {
    const [orcinaWebToken, setOrcinaWebToken] = useState(localStorage.getItem("orcinaWebToken"));

    const getToken = () => {
        return orcinaWebToken;
    };

    const setToken = (token) => {
        localStorage.setItem("orcinaWebToken", token);
        setOrcinaWebToken(token);
    };
    
    const signedIn = () => {
        return orcinaWebToken != null && orcinaWebToken != 'null';
    }
    
    return {
        getToken: getToken,
        setToken: setToken,
        signedIn: signedIn
    };
};

export default userState;
