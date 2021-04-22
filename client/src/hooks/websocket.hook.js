import {useState, useCallback} from "react"
import {io} from "socket.io-client"

export const useWebsocket = (jwtToken, myId) => {
    const [savedUsers, setSavedUsers] = useState([])
    const [findUsers, setFindUsers] = useState([])
    const [messages, setMessages] = useState([])
    const [friendId, setFriendId] = useState("")

    const socket = io("ws://localhost:8999", {
        auth: {
            token: jwtToken
        }
    })

    const findNewUsers = (email) => {
        socket.emit("find user", email)
    }

    const sendMessage = (toId, message) => {
        const str = JSON.stringify({toId, message})
        socket.emit("send message", str)
    }

    const getConversation = () => {
        socket.emit("get conversation")
    }

    const getMessagesOnOpenChat = (toId) => {
        socket.emit("get messages", toId)
    }

    const clearMessagesOnCloseChat = () => {
        setMessages([])
    }

    const setFriendIdOnOpenConversation = (id) => {
        setFriendId(id)
    }


    const listener = useCallback(() => {
        //Нужно отправить сообщение на сервер, что бы занести socket Id в бд для пользвователя
        if (jwtToken) {
            socket.emit("i logged")
        }

        socket.on("find user", msg => {
            setFindUsers(JSON.parse(msg))
        })

        socket.on("new message", json => {
            const message = JSON.parse(json)
            if (friendId === message.from || myId === message.from) {
                setMessages(prevMessages => ([...prevMessages, message]))
            }
        })

        socket.on("get conversation", json => {
            const conversations = {
                payload: JSON.parse(json)
            }
            setSavedUsers(conversations)
        })

        socket.on("new conversation", json => {
            const conversation = {
                payload: JSON.parse(json)
            }
            setSavedUsers(prevConversation => {
                return {
                    payload: [conversation.payload, ...(prevConversation.payload)]
                }
            })
        })

        socket.on("get messages", json => {
            const messages = JSON.parse(json)
            setMessages(messages)
        })

    }, [jwtToken, friendId])


    return {findNewUsers, listener, findUsers, sendMessage, messages,
        getMessagesOnOpenChat, getConversation, savedUsers, clearMessagesOnCloseChat, setFriendIdOnOpenConversation}
}
