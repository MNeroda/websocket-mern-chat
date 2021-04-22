import React from "react"
import {Switch, Route, Redirect} from "react-router-dom"
import {ChatPage} from "./pages/ChatPage";
import {AuthPage} from "./pages/AuthPage";

export const useRoutes = (isAuthenticated) => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/chat" exact>
                    <ChatPage/>
                </Route>
                <Route path="/chat/:id">
                    <ChatPage/>
                </Route>

                <Redirect to="/chat"/>
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/" exact>
                <AuthPage/>
            </Route>
            <Redirect to="/"/>
        </Switch>
    )

}