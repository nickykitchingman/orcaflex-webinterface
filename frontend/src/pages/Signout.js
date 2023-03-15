import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { trackPromise } from 'react-promise-tracker';

import LoadingDots from '../components/LoadingDots';

import { api_url, checkStatus } from '../Utility';

import userState from '../UserState';

const Signout = (props) => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

	const original = props.getUID();

	useEffect(() => {
		props.setUID(null);
	});

    trackPromise(
        fetch(api_url('/signout', props.getUID()), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',}
        }).then(
            response => {
                checkStatus(response);
				props.setUID(null);
                navigate('/home');
            }
        ).catch(
            error => {
                setMessage('Failed to sign out!');
                console.error(error);
                props.setUID(original);
            }
        ),
        'signout-area'
    )

    return (
        <div id="signout-page">
            <div className="message">{message}</div>
            <LoadingDots area="signout-area" />
        </div>
    )
};

export default Signout;