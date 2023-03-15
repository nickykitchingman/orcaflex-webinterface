import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { trackPromise } from 'react-promise-tracker';

import LoadingDots from '../components/LoadingDots';

import { api_url, checkStatus } from '../Utility';

import userState from '../UserState';

const Signout = (props) => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    props.setState(false);

    trackPromise(
        fetch(api_url('/signout'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',}
        }).then(
            response => {
                checkStatus(response);
                navigate('/home');
            }
        ).catch(
            error => {
                setMessage('Failed to sign out!');
                console.error(error);
                props.setState(true);
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