import React from 'react'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"

import Home from '../pages/Home'
import Upload from '../pages/Upload'
import Process from '../pages/Process'
import Login from '../pages/Login'
import Signout from '../pages/Signout'

import { RouterError } from '../pages/Error'

const Router = (props) => {
    const requireLogin = (normal) => {
        if (props.getState()) {
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
                    element={requireLogin(<Process />)}  
                    errorElement={<RouterError />}
                />    
                <Route
                    path="/login"
                    element={<Login getState={props.getState} setState={props.setState} />}
                    errorElement={<RouterError />}
                />
                <Route
                    path="/signout"
                    element={<Signout getState={props.getState} setState={props.setState} />}
                    errorElement={<RouterError />}
                />
            </Routes>        
        </BrowserRouter>
    );
}

export default Router;