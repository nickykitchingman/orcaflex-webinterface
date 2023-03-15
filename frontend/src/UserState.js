import { useState } from 'react';

const userState = () => {
	const [userID, setUserID] = useState(localStorage.getItem("userID"));

    const getUID = () => {
        return userID;
    };

    const setUID = (uid) => {
        localStorage.setItem("userID", uid);
		setUserID(uid);
    };
	
	const signedIn = () => {
		return getUID() != null && getUID() != 'null';
	};
    
    return { 
        getUID: getUID,
        setUID: setUID,
		signedIn: signedIn
    };
};

export default userState;
