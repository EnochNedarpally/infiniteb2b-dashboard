import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom";

//Layouts
import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts/index";

//routes
import { authProtectedRoutes, publicRoutes, userProtectedRoutes, vendorProtectedRoutes } from "./allRoutes";
import { AuthProtected } from './AuthProtected';

const Index = () => {
const authUserData = JSON.parse(sessionStorage.getItem("authUser"));
const [privateRoutes, setPrivateRoutes] = useState(authProtectedRoutes)
const navigate = useNavigate()


useEffect(()=>{
    if(authUserData){
    const routeData = getURL(authUserData.data.role)
    setPrivateRoutes(routeData)
    }
},[authUserData])
const getURL = (role)=>{
    if(role == "SUPERADMIN") return authProtectedRoutes
    if(role == "vendor"){
        // navigate("/vendor/login")
        return vendorProtectedRoutes
    } 
    else return userProtectedRoutes
  }
    return (
        <React.Fragment>
            <Routes>
                <Route>
                    {publicRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={
                                <NonAuthLayout>
                                    {route.component}
                                </NonAuthLayout>
                            }
                            key={idx}
                            exact={true}
                        />
                    ))}
                </Route>

                <Route>
                    {privateRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={
                                <AuthProtected>
                                    <VerticalLayout>{route.component}</VerticalLayout>
                                </AuthProtected>}
                            key={idx}
                            exact={true}
                        />
                    ))}
                </Route>
            </Routes>
        </React.Fragment>
    );
};

export default Index;