import React from 'react'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"

import Home from '../pages/Home'
import Upload from '../pages/Upload'
import Process from '../pages/Process'
import Login from '../pages/Login'
import Signout from '../pages/Signout'
import Signup from '../pages/Signup'

import { RouterError } from '../pages/Error'

const Router = (props) => {
    const requireLogin = (normal) => {
        if (props.signedIn()) {
            return normal
        } else {
            return <Navigate to="/login" />
        }
    };

    return (
        <BrowserRouter>        
            <Routes>   
                <Route 
                    path="/" 
                    element={<Navigate to="/home" />}
                />
                <Route 
                    path="/home" 
                    element={<Home />}
                    errorElement={<RouterError />}
                />
                <Route 
                    path="/upload" 
                    element={requireLogin(<Upload />)}  
                    errorElement={<RouterError />}
                />     
                <Route 
                    path="/process" 
                    element={requireLogin(<Process getUID={props.getUID} />)}  
                    errorElement={<RouterError />}
                />    
                <Route
                    path="/login"
                    element={<Login getUID={props.getUID} setUID={props.setUID} signedIn={props.signedIn} />}
                    errorElement={<RouterError />}
                />
                <Route
                    path="/signout"
                    element={<Signout getUID={props.getUID} setUID={props.setUID} signedIn={props.signedIn} />}
                    errorElement={<RouterError />}
                />
                <Route
                    path="/signup"
                    element={<Signup getUID={props.getUID} setUID={props.setUID} signedIn={props.signedIn} />}
                    errorElement={<RouterError />}
                />
            </Routes>        
        </BrowserRouter>
    );
}

export default Router;