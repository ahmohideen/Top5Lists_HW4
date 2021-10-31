import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from '../api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    LOGIN_USER: "LOGIN_USER",
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true
                })
            }

            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        //console.log("at index auth.getloggedin")
        let response = null;
        let err = null;
        try{
            console.log("at index auth.getloggedin");
            response = await api.getLoggedIn();
        }
        catch(error){
            console.log("GETLOGGEDIN DIDNT WORK");
            //console.log(error);
            err = error
        }
        if (response !== null && response.status === 200) {
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
        else{
            console.log("get loggedin error");//alert
            console.log(response===null);
        }
    }

    auth.loginUser = async function(userData, store){
        let response = null;
        let err = null;
        try{
            console.log("at login in index.js");
            console.log(userData);
            response = await api.loginUser(userData);
            console.log(response);
        }
        catch(error){
            console.log(error);
            console.log("error encountered in login");
        }
        // authReducer({
        //     type: AuthActionType.LOGIN_USER,
        //     payload: {
        //         user: response.data.user
        //     }
        // })
        // history.push("/");
        // store.loadIdNamePairs();
        if (response !== null && response.status === 200) {
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
            store.loadIdNamePairs();
        }
        else{
            console.log("ERROR")
        }
    }

    auth.registerUser = async function(userData, store) {
        let response = null;
        let err = null;
        try{
            response = await api.registerUser(userData);  
        }
        catch(error){
            console.log("catch");
            console.log(error.message);
            err = error;
        }

        if (response !== null && response.status === 200) {
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
            store.loadIdNamePairs();
        }
        else{
            console.log("user creation error");//alert
            console.log(response===null);

            if(err.message.includes("401")){
                console.log("password too short!")//make this an alert!
            }

        }
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };