import React from 'react'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"

import Home from '../pages/Home'
import Upload from '../pages/Upload'
import Process from '../pages/Process'
import Login from '../pages/Login'
import { RouterError } from '../pages/Error'

const Router = () => {
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
                    element={<Upload />}  
                    errorElement={<RouterError />}
                />     
                <Route 
                    path="/process" 
                    element={<Process />}  
                    errorElement={<RouterError />}
                />    
                <Route
                    path="/login"
                    element={<Login />}
                    errorElement={<Error />}
                />
            </Routes>        
        </BrowserRouter>
    );
}

export default Router;