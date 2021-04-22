import React, {useEffect} from "react"
import {BrowserRouter as Router} from "react-router-dom"
import "normalize.css"
import "materialize-css"
import {useRoutes} from "./routes";
import {AuthContext} from "./context/AuthContext";
import {useAuth} from "./hooks/auth.hook"
import {useWebsocket} from "./hooks/websocket.hook";
import {WebsocketContext} from "./context/WebsocketContext";

function App() {

    const {token, login, logOut, userId} = useAuth()
    const isAuthenticated = !!token
    const routes = useRoutes(isAuthenticated)

    const {findNewUsers, findUsers, listener, messages, sendMessage, getMessagesOnOpenChat,
        getConversation, savedUsers, clearMessagesOnCloseChat, setFriendIdOnOpenConversation} = useWebsocket(token, userId)

    useEffect(() => {
        listener()
    }, [listener])

    return (
        <WebsocketContext.Provider value={{
            findNewUsers, findUsers, messages, sendMessage, getMessagesOnOpenChat, getConversation, savedUsers,
            clearMessagesOnCloseChat, setFriendIdOnOpenConversation
        }}>
            <AuthContext.Provider value={{
                token, login, logOut, userId, isAuthenticated
            }}>
                <Router>
                    <div>

                        {routes}

                    </div>
                </Router>
            </AuthContext.Provider>
        </WebsocketContext.Provider>
    )
}

export default App;
