import { useState } from 'react';

const userState = () => {
	const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));

    const getToken = () => {
        return accessToken;
    };

    const setToken = (token) => {
        localStorage.setItem("accessToken", token);
		setAccessToken(token);
    };
	
	const signedIn = () => {
		return accessToken != null && accessToken != 'null';
	}
    
    return {
        getToken: getToken,
        setToken: setToken,
		signedIn: signedIn
    };
};

export default userState;
