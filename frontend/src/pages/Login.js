import React, { useState } from 'react';
import { trackPromise } from 'react-promise-tracker';

import InputField from '../components/InputField';
import LoadingDots from '../components/LoadingDots';

import { api_url, checkStatus } from '../Utility';

import './Login.css';

const Login = () => {
    const [message, setMessage] = useState('');

    const handleSubmit = e => {
        e.preventDefault()

        const username = e.target.elements['username'].value;
        const password = e.target.elements['password'].value;

        const formData = new FormData();

        trackPromise(
            fetch(api_url('/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',},
                body: JSON.stringify({
                    'username': username, 
                    'password': password
                })
            }).then(
                response => {
                    checkStatus(response);
                    navigate('/upload');
                }
            ).catch(
                error => {
                    setMessage('Invalid login!');
                    console.error(error);

                    e.target.elements['username'].value = '';
                    e.target.elements['password'].value = '';
                }
            ),
            'login-area'
        )
    };

    return (
        <div id="login-page">
            <div className="message">{message}</div>

            <div className="input-fields">
                <form onSubmit={handleSubmit}>
                    <InputField id="username" text="Username"/>
                    <InputField id="password" text="Password"/>
                    <input type="Submit" value="Login" />
                </form>
            </div>

            <LoadingDots area="login-area" />
        </div>
    )
};

export default Login;