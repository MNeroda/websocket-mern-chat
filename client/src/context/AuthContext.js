import {createContext} from "react"

function nullFunc() {}

export const AuthContext = createContext({
    token: null,
    userId: null,
    login: nullFunc,
    logOut: nullFunc,
    isAuthenticated: false
})