import {createContext} from "react"

function nullFunc() {}

export const WebsocketContext = createContext({
    findNewUsers: nullFunc(),
    findUsers : [],
    messages: [],
    sendMessage: nullFunc(),
    getMessagesOnOpenChat: nullFunc(),
    getConversation: nullFunc(),
    savedUsers: [],
    clearMessagesOnCloseChat: nullFunc(),
    setFriendIdOnOpenConversation: nullFunc()
})