import {useState, useContext, useEffect} from "react"
import {useParams} from "react-router-dom"
import "../styles/chat.css"
import {WebsocketContext} from "../context/WebsocketContext";
import {MessageList} from "./MessageList";

export const Chat = () => {
    const [messageInput, setMessageInput] = useState("")
    const friendId = useParams().id
    const io = useContext(WebsocketContext)

    useEffect(() => {
        if (friendId) {
            io.getMessagesOnOpenChat(friendId)
        }
    }, [friendId])

    const submitHandler = (e) => {
        e.preventDefault()
        io.sendMessage(friendId, messageInput)
        setMessageInput("")
    }

    if(!friendId) {
        return (
            <h1>Выберете чат</h1>
        )
    }

    return (
        <div className="row no-mp-block full-height-block">

            <div className="col s12 messages">
                <MessageList messages={io.messages} friendId={friendId}/>
            </div>


            <div className="col s9 send-message-box blue darken-1">
                <form className="send-message-form input-field" onSubmit={submitHandler}>
                    <textarea
                        id="textarea1"
                        className="materialize-textarea input-field area-input"
                        onChange={event => setMessageInput(event.target.value)}
                        value={messageInput}
                    >

                    </textarea>
                    <label htmlFor="textarea1">Введите сообщение:</label>
                    <button className="btn waves-effect waves-light send-btn" type="submit" name="action">Отправить
                        <i className="material-icons right">send</i>
                    </button>
                </form>
            </div>

        </div>
    )
}